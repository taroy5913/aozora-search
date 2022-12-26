# Aozora Search

Aozora Bunko<青空文庫> Reader

Please read from here.

- https://taroy5913.github.io/aozora-search/

## Schema

- Novel(json)
    - id: string                
    - title: string             # タイトル
    - author: string            # 作者
    - text: string              # 本文(冒頭)、partialText?

- NovelStatus(localStorage)
    - novelId: string           # Novel.id
    - alreadyRead: string       # 既読 / 未読
    - currentPosition: string   # 現在の位置
    - isFavorite: boolean       # お気に入り

- Novel(onMemory)
    - id: string
    - title: string
    - author: string
    - text: string
    - alreadyRead: string
    - currentPosition: string
    - isFavorite: boolean

