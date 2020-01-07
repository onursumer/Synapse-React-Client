import * as React from 'react'
import { Checkbox } from '../../../lib/containers/widgets/Checkbox'
import { Range, RangeValues } from '../../../lib/containers/widgets/Range'
import { RadioGroup } from '../../../lib/containers/widgets/RadioGroup'
import { useState } from 'react'

export const WidgetDemo: React.FunctionComponent = () => {
  const options = [
    { label: 'option 1', value: 'option1' },
    { label: 'option 2', value: 'option2' },
    { label: 'option 3', value: 'option3' },
  ]
  const [check1, setCheck1] = useState(true)
  const [check2, setCheck2] = useState(false)
  const [optionValue, setOptionValue] = useState('option2')
  const [rangeNumberValue, setRangeNumberValue] = useState(() => 
  {
    const result: RangeValues = {
      min: '10.5',
      max: '30',
    }
    return result
  })
  const [rangeDateValue, setRangeDateValue] = useState(() => {
    const result: RangeValues = {
      min: new Date(2019, 5, 10).toISOString(),
      max: new Date(2019, 6, 11).toISOString(),
    }
    return result
  })

  return (
    <div className="container">
      <div style={{ fontWeight: 'bold' }}></div>
      <h4 style={{ marginTop: '20px' }}>Checkbox</h4>
      Checkbox 1 is {check1 ? 'checked' : 'unchecked'}
      <br />
      Checkbox 2 is {check2 ? 'checked' : 'unchecked'}
      <br />
      <Checkbox
        label="Initially Checked Checkbox"
        id="ch1"
        checked={true}
        onChange={(checked: boolean) => setCheck1(checked)}
      ></Checkbox>
      <Checkbox
        label="Initially Unchecked Checkbox"
        id="ch2"
        onChange={(checked: boolean) => setCheck2(checked)}
      ></Checkbox>
      <hr></hr>
      <h4 style={{ marginTop: '20px' }}>Radio</h4>
      Option Value is: {optionValue}
      <br />
      <RadioGroup
        id="radioGroup1"
        options={options}
        value={optionValue}
        onChange={(value: string) => setOptionValue(value)}
      ></RadioGroup>
      <hr></hr>
      <h4 style={{ marginTop: '20px' }}>Number Range</h4>
      Number Range Value is:
      {` ${rangeNumberValue.min} - ${rangeNumberValue.max}`}
      <br />
      <Range
        type="number"
        initialValues={{ min: rangeNumberValue.min, max: rangeNumberValue.max }}
        onChange={(values: RangeValues) => setRangeNumberValue(values)}
      ></Range>
      <hr></hr>
      <h4>Date Range</h4>
      Number Date Value is: {rangeDateValue.min} - {rangeDateValue.max}
      <br />
      <Range
        type="date"
        initialValues={{ min: rangeDateValue.min, max: rangeDateValue.max }}
        onChange={(values: RangeValues) => setRangeDateValue(values)}
      ></Range>
    </div>
  )
}