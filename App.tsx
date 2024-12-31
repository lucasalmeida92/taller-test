import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Transaction = {
  id: number,
  date: string,
  description: string,
  amount: number,
}

const MOCK: Transaction[] = [
  {
    id: 1,
    date: '2025-01-12',
    description: 'lorem ipsum',
    amount: 12,
  },
  {
    id: 2,
    date: '2025-01-20',
    description: 'lorem ipsum 2',
    amount: 13,
  },
  {
    id: 3,
    date: '2025-01-25',
    description: 'lorem ipsum 3',
    amount: 13,
  },
];

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const getTransactions = async () => {
      setHasError(false);

      const promise = new Promise<Transaction[]>((resolve, reject) => {
        setTimeout(() => {
          resolve(MOCK);
        }, 3000);
      });

      try {
        const response = await promise;

        setTransactions(response);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    getTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (startDate !== '' || endDate !== '') {
      return transactions.filter((item) => {
        if (
          new Date(item.date) >= new Date(startDate)
          && new Date(item.date) <= new Date(endDate)
        ) return true;
      });
    } else {
      return transactions;
    }
  }, [startDate, endDate]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const startDate = data.get('startDate');
    const endDate = data.get('endDate');
    setStartDate(startDate);
    setEndDate(endDate);
  };

  if (isLoading) return <p>Loading...</p>;

  if (hasError) return <p>It was not possible to load transactions. Try again later.</p>;

  return (
    <>
      <form
        style={{ display: 'flex', gap: '16px' }}
        onSubmit={handleSubmit}
      >
        <input type="date" id="startDate" name="startDate" />
        <input type="date" id="endDate" name="endDate" />
        <button type="submit">Apply filter</button>
      </form>
      {filteredTransactions?.length
        ? filteredTransactions.map((item) => (
          <div key={item.id}>
            <h2>Transaction ID: {item.id}</h2>
            <p>Date: {item.date}</p>
            <p>Description: {item.description}</p>
            <p>Amount: {item.amount}</p>
          </div>
        )) 
        : <p>No transactions.</p>} 
    </>
  )
}

export default App
