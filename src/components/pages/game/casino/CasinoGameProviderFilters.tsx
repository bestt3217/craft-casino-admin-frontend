import React, { useState } from 'react'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'

const CasinoGameProviderFilters = () => {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')

  return (
    <div className='flex gap-4'>
      <div>
        <Label>Provider Name</Label>
        <Input
          name='search'
          placeholder='Provider Name'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <Label>Type</Label>
        <Select
          className='w-full'
          placeholder='Type'
          options={[
            {
              value: 'all',
              label: 'All',
            },
            {
              value: 'nexusggr',
              label: 'NexusGGR',
            },
            {
              value: 'blueocean',
              label: 'BlueOcean',
            },
          ]}
          defaultValue={type}
          onChange={(e) => setType(e)}
        />
      </div>
    </div>
  )
}

export default CasinoGameProviderFilters
