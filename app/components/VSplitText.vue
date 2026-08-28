<script lang="ts">
import type { PropType, VNode } from 'vue'
import type { SplitText } from '~/utils/split-text.ts'
import { defineComponent, h } from 'vue'

export default defineComponent({
	inheritAttrs: false,
	props: {
		content: { type: [String, null, undefined], required: true },
		render: String as PropType<'all' | 'lines' | 'words' | 'chars'>,
	},
	emits: {
		customEvent: Function,
		onCustomEvent: Function,
	},
	setup(props, { attrs }) {
		const splitTextData = splitText(props.content)

		function renderLine(line: SplitText['all'][0]) {
			return line.content.map((word) => {
				return h('div', {
					'class': attrs.class, 'data-word-index': word.index },
				word.content.map((char) => {
					return h('div', {
						'style': { '--data-char-index': char.index },
						'data-char-content': char.content },
					char.content)
				}))
			})
		}

		// const emits = defineEmits(['customEvent'])

		return () => {
			let renderNodes: VNode[] | VNode[][] | null = null

			if (props.render === 'chars') {
				renderNodes = splitTextData.characters.map((char, i) => {
					return h('span', { class: [attrs.class, 'split-text-char'], style: { '--data-char-index': i } }, char)
				})
			}
			else if (props.render === 'words') {
				renderNodes = splitTextData.words.map((word, i) => {
					return h('span', { 'class': attrs.class, 'data-word-index': i }, word)
				})
			}
			else if (props.render === 'lines') {
				renderNodes = splitTextData.lines.map((line, i) => {
					return h('div', { 'class': attrs.class, 'data-line-index': i }, line)
				})
			}
			else if (splitTextData.all.length === 1) {
				renderNodes = renderLine(splitTextData.all[0])
			}
			else {
				renderNodes = splitTextData.all.map(line => renderLine(line))
			}

			return renderNodes
		}
	},
})
</script>
