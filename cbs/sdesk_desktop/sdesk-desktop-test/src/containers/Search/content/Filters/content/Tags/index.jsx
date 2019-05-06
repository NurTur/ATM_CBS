import React from 'react'
import TagList from './content/TagList'
import Tag from './content/Tag'
import labels from 'containers/DataPicker/labels'

const getLabel = (key) => labels[key]
const getTag = (name, selected, onClick) =>
	<Tag
		key={name}
		selected={selected}
		onClick={() => onClick(name, !selected)}
	>
		{getLabel(name)}
	</Tag>

const Tags = ({tags, onClick}) =>
	<TagList>
		{tags
			.map((selected, name) => getTag(name, selected, onClick))
			.toIndexedSeq()
			.toArray()
		}
	</TagList>

export default Tags