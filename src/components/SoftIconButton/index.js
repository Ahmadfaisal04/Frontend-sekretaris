'use client'

import { forwardRef } from 'react'
import { IconButton } from '@mui/material'

const SoftIconButton = forwardRef(({ children, ...rest }, ref) => (
  <IconButton
    ref={ref}
    {...rest}
  >
    {children}
  </IconButton>
))

SoftIconButton.displayName = 'SoftIconButton'

export default SoftIconButton 