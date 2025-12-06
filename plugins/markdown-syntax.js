function _visit(children, fn) {
    children.forEach((ch) => {
        fn(ch)
        if (ch.children) _visit(ch.children, fn)
    })
}

function _parseNoodlMarkupPlugin() {
    return function (ast) {
        if (!ast || !ast.children) return;
        _visit(ast.children, (node) => {
            if (typeof node.value === 'string') {
                node.value = node.value.replace(
                    /(&lt;|<)\#\#.*?\#\#(&gt;|>)/g,
                    ''
                )
            }
        })
    }
}

function _parseRenderedMarkupPlugin() {
    return function (ast) {
        if (!ast || !ast.children) return;
        _visit(ast.children, (node) => {
            if (node.type === 'element' && node.tagName === 'p') {
                const hasContent = node.children.find((child) =>
                    Boolean(child.value)
                )

                if (!hasContent) node.properties.class = 'is-hidden'
            }
        })
    }
}

module.exports = {
    _parseNoodlMarkupPlugin,
    _parseRenderedMarkupPlugin,
}
