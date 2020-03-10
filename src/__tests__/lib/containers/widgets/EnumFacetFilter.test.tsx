import * as React from 'react'
import {
  EnumFacetFilter,
  EnumFacetFilterProps,
} from '../../../../lib/containers/widgets/query-filter/EnumFacetFilter'
import {
  ColumnModel,
  FacetColumnResultValueCount,
} from '../../../../lib/utils/synapseTypes'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

const SynapseClient = require('../../../../lib/utils/SynapseClient')

const mockCallback = jest.fn(() => null)
const mockOnClear = jest.fn(() => null)

SynapseClient.getUserProfiles = jest.fn().mockResolvedValue({
  list: [
    { ownerId: '123', userName: 'somename' },
    { ownerId: '1234', userName: 'somename2' },
  ],
})

SynapseClient.getAllEntityHeader = jest.fn().mockResolvedValue([
  { id: '123', name: 'Entity1' },
  { id: '1234', name: 'Entity2' },
])

const stringFacetValues: FacetColumnResultValueCount[] = [
  { value: 'Honda', count: 2, isSelected: false },
  { value: 'Chevy', count: 1, isSelected: true },
  {
    value: 'org.sagebionetworks.UNDEFINED_NULL_NOTSET',
    count: 1,
    isSelected: false,
  },
]

const userEntityFacetValues: FacetColumnResultValueCount[] = [
  {
    value: 'org.sagebionetworks.UNDEFINED_NULL_NOTSET',
    count: 2,
    isSelected: false,
  },
  { value: '123', count: 1, isSelected: false },
  { value: '1234', count: 1, isSelected: false },
]

const columnModel: ColumnModel = {
  columnType: 'STRING',
  facetType: 'enumeration',
  id: '86423',
  name: 'Make',
}

function generateManyFacetColumnResultValueCounts(): FacetColumnResultValueCount[] {
  const result: FacetColumnResultValueCount[] = []
  // create ranom facet values with 6th item having largest count
  //and have an item with count = 1
  for (let i = 0; i < 20; i++) {
    result.push({
      value: `Honda${i}`,
      count: i === 5 ? 12 : i === 6 ? 1 : Math.floor(Math.random() * 10),
      isSelected: false,
    })
  }
  return result
}

function createTestProps(
  overrides?: EnumFacetFilterProps,
): EnumFacetFilterProps {
  return {
    facetValues: stringFacetValues,
    columnModel: columnModel,
    token: '12345',
    onChange: mockCallback,
    onClear: mockOnClear,
    ...overrides,
  }
}

let container: HTMLElement
let props: EnumFacetFilterProps

function init(overrides?: EnumFacetFilterProps) {
  props = createTestProps(overrides)
  container = render(<EnumFacetFilter {...props} />).container
}

beforeEach(() => init())

describe('initialization', () => {
  it('should initiate selected items correctly', async () => {
    const checkboxes = container.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    )
    expect(checkboxes).toHaveLength(3)
    checkboxes.forEach((checkbox, i) => {
      if (i === 1) {
        expect(checkbox.checked).toBe(true)
      } else {
        expect(checkbox.checked).toBe(false)
      }
    })
  })

  describe('label initialization', () => {
    it('should set labels correctly for STRING type', async () => {
      const labels = container.querySelectorAll<HTMLSpanElement>(
        'input[type="checkbox"] ~ span',
      )
      expect(labels).toHaveLength(3)
      labels.forEach((label, i) => {
        if (i !== 2) {
          expect(label.textContent).toBe(
            `${stringFacetValues[i].value} (${stringFacetValues[i].count})`,
          )
        } else {
          expect(label.textContent).toBe(
            `Not Set (${stringFacetValues[i].count})`,
          )
        }
      })
    })

    it('should hide > 5 items if items with index >=5 not selected', async () => {
      const facetValues = generateManyFacetColumnResultValueCounts()

      init({
        ...props,
        facetValues,
      })

      const labels = container.querySelectorAll<HTMLSpanElement>(
        'input[type="checkbox"] ~ span',
      )
      expect(labels).toHaveLength(5)
      expect(labels.item(0).textContent).toContain('(12)')
    })

    it('should show all items if items with index >=5 is selected', async () => {
      const facetValues = generateManyFacetColumnResultValueCounts()
      facetValues.find(item => item.count === 1)!.isSelected = true

      init({
        ...props,
        facetValues,
      })

      const labels = container.querySelectorAll('input[type="checkbox"] ~ span')
      expect(labels).toHaveLength(20)
    })

    it('should set labels correctly for ENTITYID type', async () => {
      const entityColumnModel: ColumnModel = {
        ...columnModel,
        columnType: 'ENTITYID',
        name: 'File',
      }

      const updatedProps = {
        ...props,
        facetValues: userEntityFacetValues,
        columnModel: entityColumnModel,
      }

      await act(async () => await init(updatedProps))
      const labels = container.querySelectorAll<HTMLInputElement>(
        'input ~ span',
      )
      expect(labels.item(0).textContent).toBe(
        `Not Set (${userEntityFacetValues[0].count})`,
      )
      expect(labels.item(1).textContent).toBe(
        `Entity1 (${userEntityFacetValues[1].count})`,
      )
      expect(labels.item(2).textContent).toBe(
        `Entity2 (${userEntityFacetValues[2].count})`,
      )
    })
  })

  it('should set labels correctly for USERID type', async () => {
    const userColumnModel: ColumnModel = {
      ...columnModel,
      columnType: 'USERID',
      name: 'Users',
    }

    const updatedProps = {
      ...props,
      facetValues: userEntityFacetValues,
      columnModel: userColumnModel,
    }

    await act(async () => await init(updatedProps))
    const labels = container.querySelectorAll<HTMLSpanElement>(
      'input[type="checkbox"] ~ span',
    )
    expect(labels).toHaveLength(3)
    expect(labels.item(0).textContent).toBe(
      `Not Set (${userEntityFacetValues[0].count})`,
    )
    expect(labels.item(1).textContent).toBe(
      `somename (${userEntityFacetValues[1].count})`,
    )
    expect(labels.item(2).textContent).toBe(
      `somename2 (${userEntityFacetValues[2].count})`,
    )
  })
})

describe('callbacks', () => {
  it('should trigger callback on checkbox change', () => {
    const checkboxes = container.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    )
    fireEvent.click(checkboxes.item(0))
    expect(mockCallback).toHaveBeenCalledWith(stringFacetValues[0].value, true)
    fireEvent.click(checkboxes.item(0))
    expect(mockCallback).toHaveBeenCalledWith(stringFacetValues[0].value, false)
  })

  it('should trigger callback on clear', () => {
    const clear = container.querySelector<HTMLButtonElement>('button')
    fireEvent.click(clear)
    expect(mockOnClear).toHaveBeenCalledWith(props.columnModel.name)
  })
})