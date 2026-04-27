#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const rootDir = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const explicitConfigArg = args.find(arg => arg.startsWith('--config='));
const execute = args.includes('--execute');
const configPath = path.resolve(
  rootDir,
  explicitConfigArg
    ? explicitConfigArg.split('=').slice(1).join('=')
    : process.env.TRELLO_CONFIG_PATH || 'trello/trello.config.local.json'
);
const fallbackConfigPath = path.resolve(rootDir, 'trello/trello.config.example.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadConfig() {
  const selectedPath = fs.existsSync(configPath) ? configPath : fallbackConfigPath;
  const config = readJson(selectedPath);
  if (execute) {
    config.import = { ...(config.import || {}), dryRun: false };
  }
  return { config, selectedPath };
}

function required(value, name) {
  if (!value || String(value).startsWith('YOUR_') || String(value).startsWith('TRELLO_')) {
    throw new Error(`Missing Trello configuration value: ${name}`);
  }
  return value;
}

function buildCardDescription(card) {
  const dependencies = card.dependencies && card.dependencies.length
    ? card.dependencies.map(dep => `- ${dep}`).join('\n')
    : '- Aucune';
  return [
    card.description,
    '',
    `Type : ${card.type}`,
    `Assigne : ${card.assignedTo}`,
    `Priorite : ${card.priority}`,
    `Estimation : ${card.estimate}`,
    '',
    'Dependances :',
    dependencies
  ].join('\n');
}

async function trelloRequest(client, method, url, data, params = {}) {
  const response = await client.request({ method, url, data, params });
  return response.data;
}

async function main() {
  const { config, selectedPath } = loadConfig();
  const importOptions = config.import || {};
  const boardPath = path.resolve(rootDir, importOptions.jsonPath || 'trello/queueless-trello-board.json');
  const boardData = readJson(boardPath).board;
  const dryRun = importOptions.dryRun !== false;

  console.log(`Config: ${path.relative(rootDir, selectedPath)}`);
  console.log(`Board JSON: ${path.relative(rootDir, boardPath)}`);
  console.log(`Mode: ${dryRun ? 'dry-run' : 'execute'}`);

  if (dryRun) {
    for (const list of boardData.lists) {
      console.log(`[dry-run] Liste: ${list.name}`);
      for (const card of list.cards) {
        console.log(`  [dry-run] Carte: ${card.title} -> ${card.assignedTo}`);
      }
    }
    console.log('Dry-run termine. Lancez avec --execute apres avoir renseigne une configuration locale.');
    return;
  }

  const boardId = required(config.trello && config.trello.boardId, 'trello.boardId');
  const key = required(config.trello && config.trello.apiKey, 'trello.apiKey');
  const token = required(config.trello && config.trello.token, 'trello.token');
  const baseURL = (config.trello && config.trello.baseUrl) || 'https://api.trello.com/1';

  const client = axios.create({
    baseURL,
    params: { key, token }
  });

  const trelloBoard = await trelloRequest(client, 'get', `/boards/${boardId}`, null, { fields: 'id,name' });
  const resolvedBoardId = trelloBoard.id;
  console.log(`Board cible: ${trelloBoard.name} (${resolvedBoardId})`);

  const boardLabels = await trelloRequest(client, 'get', `/boards/${resolvedBoardId}/labels`, null, { limit: 1000 });
  const labelByName = new Map(boardLabels.map(label => [label.name, label]));

  if (importOptions.createLabels !== false) {
    for (const label of boardData.labels || []) {
      if (!labelByName.has(label.name)) {
        const created = await trelloRequest(client, 'post', `/labels`, null, {
          idBoard: resolvedBoardId,
          name: label.name,
          color: (config.labelColors && config.labelColors[label.name]) || label.color || null
        });
        labelByName.set(created.name, created);
        console.log(`Label cree: ${created.name}`);
      }
    }
  }

  const existingLists = await trelloRequest(client, 'get', `/boards/${resolvedBoardId}/lists`, null, { cards: 'open' });
  const listByName = new Map(existingLists.map(list => [list.name, list]));

  for (const list of boardData.lists) {
    let trelloList = listByName.get(list.name);
    if (!trelloList) {
      trelloList = await trelloRequest(client, 'post', '/lists', null, {
        idBoard: resolvedBoardId,
        name: list.name,
        pos: 'bottom'
      });
      listByName.set(list.name, trelloList);
      console.log(`Liste creee: ${list.name}`);
    } else {
      console.log(`Liste reutilisee: ${list.name}`);
    }

    const cardsInList = await trelloRequest(client, 'get', `/lists/${trelloList.id}/cards`);
    const cardTitleSet = new Set(cardsInList.map(card => card.name));

    for (const card of list.cards) {
      if (importOptions.skipExistingCardsByTitle !== false && cardTitleSet.has(card.title)) {
        console.log(`Carte ignoree car deja presente: ${card.title}`);
        continue;
      }

      const labelIds = [];
      for (const labelName of [card.type, `Priorite ${card.priority}`]) {
        const label = labelByName.get(labelName);
        if (label && importOptions.attachLabels !== false) {
          labelIds.push(label.id);
        }
      }

      const memberId = config.memberIds && config.memberIds[card.assignedTo];
      const memberIds = memberId && !String(memberId).startsWith('TRELLO_') && importOptions.assignMembers !== false
        ? [memberId]
        : [];

      const createdCard = await trelloRequest(client, 'post', '/cards', null, {
        idList: trelloList.id,
        name: card.title,
        desc: buildCardDescription(card),
        idLabels: labelIds.join(','),
        idMembers: memberIds.join(',')
      });
      console.log(`Carte creee: ${card.title}`);

      if (importOptions.createChecklists !== false && card.checklist && card.checklist.length) {
        const checklist = await trelloRequest(client, 'post', `/cards/${createdCard.id}/checklists`, null, {
          name: 'Sous-taches'
        });
        for (const item of card.checklist) {
          await trelloRequest(client, 'post', `/checklists/${checklist.id}/checkItems`, null, {
            name: item,
            pos: 'bottom'
          });
        }
      }
    }
  }

  console.log('Import Trello termine.');
}

main().catch(error => {
  const message = error.response && error.response.data
    ? JSON.stringify(error.response.data)
    : error.message;
  console.error(`Erreur import Trello: ${message}`);
  process.exit(1);
});
