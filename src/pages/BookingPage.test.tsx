import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookingPage from './BookingPage';

describe('BookingPage', () => {
  it('renders without crashing', () => {
    let error: any;
    try {
      render(
        <MemoryRouter initialEntries={['/booking/1']}>
          <Routes>
            <Route path="/booking/:id" element={<BookingPage />} />
          </Routes>
        </MemoryRouter>
      );
    } catch (e) {
      error = e;
      console.error(e);
    }
    expect(error).toBeUndefined();
  });
});
