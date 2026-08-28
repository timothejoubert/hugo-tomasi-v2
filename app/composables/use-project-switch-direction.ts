export type ProjectSwitchDirection = 'prev' | 'next' | null

/**
 * Set right before navigating to a neighbor project (VProjectPage.vue's prev/next links), read
 * once by the next VProjectPage instance to animate its content in from the matching side —
 * `useState` (not a plain shared ref) because the whole component is remounted on every project
 * change (no keepalive), so the value must survive that full unmount/remount, while staying
 * isolated per-request in SSR.
 */
export function useProjectSwitchDirection() {
	return useState<ProjectSwitchDirection>('project-switch-direction', () => null)
}
