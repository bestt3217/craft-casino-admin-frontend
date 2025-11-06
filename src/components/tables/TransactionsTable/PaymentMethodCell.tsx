import { useMemo } from 'react'

const PaymentMethodCell = ({ method }: { method: string }) => {
  const _method = useMemo(() => {
    if (method === 'bank') {
      return 'Havale'
    }
    if (method === 'credit') {
      return 'Kredi Kartı'
    }

    return method
  }, [method])

  return <button className='hover:text-brand-500 capitalize'>{_method}</button>
}

export default PaymentMethodCell
