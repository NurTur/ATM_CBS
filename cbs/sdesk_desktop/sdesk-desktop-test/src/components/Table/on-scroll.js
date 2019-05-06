function onScroll(e) {
	if (e.target.tagName !== `TABLE`) return true
	const offsetWidth = parseInt(e.target.offsetWidth, 10) || 0
	const srollWidth = parseInt(e.target.scrollLeft, 10) || 0
	const width = `${offsetWidth + srollWidth}px`
	for (let el of e.target.children) {
		el.style.width = width
	}
}

export default onScroll
