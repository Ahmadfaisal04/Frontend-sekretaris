'use client'

import { forwardRef } from 'react'
import { Card } from '@mui/material'

const SoftCard = forwardRef(({ children, ...rest }, ref) => (
  <Card
    ref={ref}
    {...rest}
  >
    {children}
  </Card>
))

SoftCard.displayName = 'SoftCard'

export default SoftCard 