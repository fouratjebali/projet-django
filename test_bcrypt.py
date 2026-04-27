import bcrypt
h = '$2a$10$YQ98zXJ6KW8YfKZPqh.NZuF1tEiLhQq3B/Xm4hLhXZq5mZgZKvBCO'
print('len', len(h))
for p in ['Password123!','password123','admin123','Password123','QueueLess2026!Secure']:
    try:
        print(p, bcrypt.checkpw(p.encode(), h.encode()))
    except Exception as e:
        print(p, 'ERR', e)
