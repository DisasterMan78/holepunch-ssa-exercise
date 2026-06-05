import { render, screen } from '@testing-library/react'

import Home from '../../app/page'

const pageHeading = 'Scheduling API User Simulator'
const formTitleText = 'Scheduling Form'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toHaveTextContent(pageHeading)
  })

  it('renders the scheduling-form component', async () => {
    render(<Home />)
    const formTitle = await screen.findByText(formTitleText)

    expect(formTitle).toBeInTheDocument()
  })

})
