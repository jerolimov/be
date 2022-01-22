# [GraphCMS](https://graphcms.com/) schemas

## Enum Asset type

* Artwork

## Assets

* type: AssetType (enum)
* importFilename: string

## Categories (ordered by sortIndex)

* id: string! (id, required, unique, system field)
* slug: string! (slug, required, unique)
* title: string! (single line, required)
* sortIndex: number! (integer, required)

## Pages (ordered by sortIndex)

* id: string! (id, required, unique, system field)
* slug: string! (slug, required, unique)
* title: string! (single line, required)
* content: string! (multi line, markdown, required)
* sortIndex: number! (integer, required)

## Artwork (ordered by wpPublishedAt)

* id: string! (id, required, unique, system field)
* slug: string! (slug, required, unique)
* title: string! (single line, required)
* technique: string (single line)
* material: string (single line)
* size: string (single line)
* images: Asset[]
* categories: Category[]
* sortIndex: number! (integer, required)
* importPublishedAt: Date (Date and time)
