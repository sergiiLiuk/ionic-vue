import getKeyPath from 'keypather/get'

function sortByKey (array, key) {
  return array.sort((a, b) => {
    let x = key.split('.').reduce((i, j) => i[j], a)
    let y = key.split('.').reduce((i, j) => i[j], b)
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
}

export default function search ({ list, search, fields, filter, sortKey }) {
  // If no list is supplied return an empty array
  if (!list) return []

  // If there is a search string, and defined fields to search in, filter the list
  if (search && fields && fields.length > 0) {
    const keywords = search.toLowerCase().split(' ')

    let matches = 0

    list = list.filter(item => {
      matches = 0
      for (const keyword of keywords) {
        for (const field of fields) {
          let val = getKeyPath(item, field)
          if (val && val.toLowerCase().includes(keyword)) {
            matches++
            break
          }
        }
      }
      if (matches >= keywords.length) return true
      else return false
    })
  }

  if (filter) {
    let matches = 0
    let numFilters = Object.keys(filter).length

    list = list.filter(item => {
      matches = 0
      for (let key in filter) {
        // Return item if filter array is empty or null
        if (!filter[key].length) {
          matches++
          continue
        }
        // Get the key from the current looped item
        let val = key.split('.').reduce((a, b) => a?.[b], item)
        if (filter[key].includes(val)) {
          matches++
        }
      }

      return matches >= numFilters
    })
  }

  // If no sort key is supplied, return the list, otherwise sort the list and return it
  if (!sortKey) return list
  else return sortByKey(list, sortKey)
}
