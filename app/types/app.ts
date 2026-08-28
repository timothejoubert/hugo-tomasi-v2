import type { Component, ConcreteComponent, DefineComponent, Raw } from 'vue'

export type ComponentOrTagName
	= | string
		| Component
		| ConcreteComponent
		| Raw<DefineComponent>
