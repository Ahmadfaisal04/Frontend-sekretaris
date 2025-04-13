'use client'

import { forwardRef } from 'react'
import { Typography } from '@mui/material'

const SoftTypography = forwardRef(({ children, ...rest }, ref) => (
  <Typography
    ref={ref}
    {...rest}
  >
    {children}
  </Typography>
))

SoftTypography.displayName = 'SoftTypography'

export default SoftTypography 