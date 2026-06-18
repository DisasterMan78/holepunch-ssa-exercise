import { render, screen } from '@testing-library/react'
import { userEvent } from 'vitest/browser'

import SchedulingForm, { SchedulingFormProps } from '../../app/components/SchedulingForm'

const onSubmitMock = vi.fn(e => e.preventDefault);

const mockFormProps: SchedulingFormProps = {
  onSubmitFn: onSubmitMock,
}

const buttonName = 'Submit POST request to Scheduling API'
const formTitleText = 'Scheduling Form'

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Scheduling form component for ease of testing and development', () => {

  it('displays the Scheduling form', async () => {
    render(<SchedulingForm {...mockFormProps} />)
    const formTitle = await screen.findByText(formTitleText)

    expect(formTitle).toBeInTheDocument()
  })

  it('should renders a submit button', () => {
    render(<SchedulingForm {...mockFormProps} />)

    const button = screen.getByRole('button', { name: buttonName })

    expect(button).toBeInTheDocument()
  })

  it('should call onSubmit function when clicked', async () => {
    const user = userEvent.setup()

    render(<SchedulingForm {...mockFormProps} />)

    const button = screen.getByRole('button', { name: buttonName })

    await user.click(button)

    expect(onSubmitMock).toHaveBeenCalled()

  })

})
