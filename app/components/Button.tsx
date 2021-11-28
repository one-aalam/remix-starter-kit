import { PropsWithChildren, ReactElement } from "react";

type ButtonType = 'submit' | 'button' | 'reset'
type ButtonVariant = 'primary' | 'secondary' | 'accent'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

type ButtonProps = {
    type?: ButtonType
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    wide?: boolean
    circle?: boolean
    outline?: boolean
}


function Button({ type = 'submit', variant = 'primary', size = 'md', disabled = false, loading = false , wide = false, circle = false, outline = false, children }: PropsWithChildren<ButtonProps>): ReactElement {
    return (
        <button type={type} className={`btn btn-${variant} btn-${size}${loading ? ' loading' : ''}${wide ? ' btn-wide' : ''}${circle ? ' btn-circle' : ''}${outline ? ' btn-outline' : ''}`} disabled={disabled}>{children}</button>
    )
}

export default Button
