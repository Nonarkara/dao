# -*- coding: utf-8 -*-
import re

NOTES = {
    7: "我花了好几年研究城市——能画地图、建模型、解释街区。但我一直低估了一件更简单的事：我不知道自己想要什么。知道别人是一千种本事，知道自己是另一种。博士训练教我观察，但观察最终要转回自己。那第二次转身花的时间更长，但产出更有用。",
    33: "我能告诉你几乎任何你住过的社区的大量事情。给我一个下午，我能画出它怎么流动、意味着什么、忘记了谁。我曾经专业地做这件事，而且做得很好。但那段时间里，有件事我一直无法告诉你：我真正想要什么。不是我应该想要什么，不是什么东西拍出来好看。是我，在那个特定的年龄，在那个特定的时刻，需要什么。那是完全不同的地图。我还在画。",
    44: "名字是成本。你每获得一个头衔，就失去了一部分不被称呼的自由。囤积是成本——每一样东西都需要空间、维护、注意力。收获是成本——你得到的同时，就失去了没有得到时可能拥有的其他东西。老子问的不是「你有多少」，是「你为此放弃了什么」。",
}

with open('extended.js', 'r', encoding='utf-8') as f:
    content = f.read()

for n, text in NOTES.items():
    start = content.find(f'  {n}: {{')
    if start == -1:
        print(f"MISS {n}")
        continue
    
    block_start = start
    block_end = len(content)
    next_ch = re.search(r'  \d+: {{', content[start+1:])
    if next_ch:
        block_end = start + 1 + next_ch.start()
    
    block = content[block_start:block_end]
    
    if 'note_cn:' in block:
        print(f"SKIP {n}")
        continue
    
    # Find note_th: to insert after
    match = re.search(r'(note_th: "[^"]+",?)', block)
    if match:
        insert_pos = block_start + match.end()
        escaped = text.replace('\\', '\\\\').replace('\n', '\\n')
        content = content[:insert_pos] + f'\n    note_cn: "{escaped}",' + content[insert_pos:]
        print(f"Added note_cn to Ch {n}")
    else:
        print(f"NO INSERT POINT {n}")

with open('extended.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
