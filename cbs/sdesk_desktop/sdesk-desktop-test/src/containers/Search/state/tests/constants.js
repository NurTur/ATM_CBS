import randomString from 'randomstring'
import {HISTORY_LENGTH} from '../constants'

const testValues = {
	string: randomString.generate(),
	inputHistoryArray: [],
	outputHistoryArray: []
}

for (let i = 0; i <= HISTORY_LENGTH; i++) {
	testValues.inputHistoryArray.push(randomString.generate())
}
for (let i = 1; i < 4; i++) {
	testValues.inputHistoryArray.push(testValues.inputHistoryArray[i])
}
testValues.inputHistoryArray.push(``)

const start = []
const end = []
for (let i = 1; i <= HISTORY_LENGTH; i++) {
	if (i < 4) {
		start.push(testValues.inputHistoryArray[i])
	}
	else {
		end.push(testValues.inputHistoryArray[i])
	}
}

testValues.outputHistoryArray = [...end, ...start]

exports.testValues = testValues