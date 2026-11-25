import { Suspense, type ComponentType } from 'react'
import { afterEach, describe, expect, test } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import lazyView from './lazyView'

afterEach(cleanup)

const Hello = () => <p>hello</p>

describe('lazyView', () => {
  test('renders the component once its chunk loads', async () => {
    const View = lazyView(() => Promise.resolve({ default: Hello }))
    render(<Suspense fallback={<p>loading</p>}><View /></Suspense>)
    expect(await screen.findByText('hello')).toBeTruthy()
  })

  // SAYSO-APP-CZ: after a deploy, the stale-chunk reload makes the import resolve with undefined.
  // Plain lazy() then crashes the tree; lazyView keeps showing the fallback until the reload lands.
  test('keeps suspending when the import resolves with undefined', async () => {
    const View = lazyView(() => Promise.resolve(undefined as unknown as { default: ComponentType }))
    render(<Suspense fallback={<p>loading</p>}><View /></Suspense>)
    await act(() => new Promise((resolve) => setTimeout(resolve, 20)))
    expect(screen.getByText('loading')).toBeTruthy()
  })
})
