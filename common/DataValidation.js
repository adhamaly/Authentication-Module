/* eslint-disable security/detect-object-injection */
const MethodNotAllowed = require('../errors/method-not-allowed-exception')

class DataValidation {
  constructor() {}

  static checkListDuplicates(list) {
    let Map = {}
    let isDuplicates = false
    let currentElement
    
    for (let i = 0; i < list.length; i++) {
      currentElement = list[i].trim().toLowerCase()
      console.log(list[i]);
      if (Map[currentElement] == true) {
        isDuplicates = true
        throw new MethodNotAllowed('duplicates')
      }
      Map[currentElement] = true
    }

    return { duplicationState: isDuplicates, DuplicatededValue: currentElement }
  }

  static checkListOfObjectsDuplication(list, property) {
    let Map = {}
    let isDuplicates = false
    let currentElement
    for (let i = 0; i < list.length; i++) {
      currentElement = list[i][property].trim().toLowerCase()
      if (Map[currentElement] == true) {
        isDuplicates = true
        throw new MethodNotAllowed('isDuplicates')
      }
      Map[currentElement] = true
    }

    return { duplicationState: isDuplicates, DuplicatededValue: currentElement }
  }

  static checkListEmpty(list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].trim() === '') {
        throw new MethodNotAllowed('you entered empty, enter valid data')
      }
    }
  }

  static checkListOfObjectsEmpty(list, property) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][property].trim() === '') {
        throw new MethodNotAllowed('you entered empty, enter valid data')
      }
    }
  }
}

module.exports = DataValidation
