import React from 'react'
import useGetInfoFromIds, {
  UseGetInfoFromIdsProps,
} from '../../../../lib/utils/hooks/useGetInfoFromIds'
import { act } from 'react-dom/test-utils'
import ReactDOM from 'react-dom'
import { UserProfile } from '../../../../lib/utils/synapseTypes'

const HookWrapper = (props: UseGetInfoFromIdsProps) => {
  const useHookGetProfilesHook = useGetInfoFromIds(props) as UserProfile[]
  return (
    <ul>
      {useHookGetProfilesHook.map(el => (
        <li key={el.ownerId}> {el.ownerId} </li>
      ))}
    </ul>
  )
}

describe('useGetInfoFromIds hook works', () => {
  let container: HTMLDivElement
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container!)
    // @ts-ignore
    container = null
  })

  const pkg = require('../../../../lib/utils/functions/getUserData')
  const mockFn = jest.fn().mockResolvedValueOnce({ list: [{ ownerId: 'aaa' }] })
  pkg.getUserProfileWithProfilePicAttached = mockFn

  it('gets initial data', async () => {
    const props: UseGetInfoFromIdsProps = {
      ids: ['aaa'],
      type: 'USER_PROFILE',
    }
    await act(async () => {
      ReactDOM.render(<HookWrapper {...props} />, container)
    })
    const component = container.querySelector<HTMLDivElement>('ul')!
    expect(component).toBeDefined()
    expect(component.querySelectorAll('li')).toHaveLength(1)
  })
})
