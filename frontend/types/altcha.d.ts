import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'altcha-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        challengeurl?: string
        floating?: boolean
        hidefooter?: boolean
        hidelogo?: boolean
        name?: string
      }
    }
  }
}
