'use client'

import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'

const Dashboard = () => {
  return (
    <>
      <div className='col-span-12'>
        <EcommerceMetrics />
      </div>
      {/* <div className='col-span-12'>
        <MainGGRStats />
      </div> */}
      {/* <div className='col-span-12'>
        <FtdWidget />
      </div>
      <div className='col-span-12'>
        <FtdTransactionsList />
      </div> */}

      {/* <div className='col-span-12'>
        <ConversionRate />
      </div> */}

      {/* <div className='col-span-12'>
        <DemographicCard />
      </div> */}

      {/* <div className='col-span-12 space-y-6 xl:col-span-7'>

        <MonthlyGGRChart />
      </div>

      <div className='col-span-12 xl:col-span-5'>
        <MonthlyTarget />
        <DemographicCard />
      </div>

      <div className='col-span-12 xl:col-span-5'>
        <DemographicCard />
      </div> */}
    </>
  )
}

export default Dashboard
