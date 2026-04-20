import re

with open('b64.txt', 'r') as f:
    b64 = f.read().strip()

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific silentWav declaration
new_content = re.sub(
    r'(const silentWav = ")[^"]+(";)', 
    r'\g<1>' + b64 + r'\g<2>', 
    content, 
    count=1
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Replacement complete.')
