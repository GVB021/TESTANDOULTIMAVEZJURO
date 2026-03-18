import re

with open('client/src/studio/pages/room.tsx', 'r') as f:
    lines = f.readlines()

noise_substrings = [
    'Inicializando hardware do room',
    'Hardware inicializado com sucesso',
    '[WS] Recebido:',
    '[WS] Executando comando video:play',
    '[WS] Ajustando drift',
    '[WS] Vídeo estava pausado',
    '[WS] Vídeo já estava reproduzindo',
    'Diretor recebendo take para revisão',
    '[Teleprompter] Scrolling to',
    'Text control candidates:',
    'Microfone inicializando, prosseguindo',
    'Gravando sem personagem selecionado',
    'Iniciando gravação com sucesso - FORÇADO',
    'Gravação iniciada exatamente no timing',
]

kept = []
removed = 0
for line in lines:
    stripped = line.strip()
    if stripped.startswith('console.log(') and stripped.endswith(');'):
        if any(s in stripped for s in noise_substrings):
            removed += 1
            continue
    kept.append(line)

with open('client/src/studio/pages/room.tsx', 'w') as f:
    f.writelines(kept)
print(f'removed {removed} lines')
