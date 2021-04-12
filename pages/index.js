import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import produce from 'immer';
import { useUser } from '../lib/hooks'
import Layout from '../components/layout'
import TransactionAdd from '../components/Transaction/Add';
import TransactionHistory from '../components/Transaction/History';

import {
  Card, Button,
  Modal, Spin, message,
} from 'antd';

import {
  PoundCircleOutlined,
  UserOutlined,
  SendOutlined,
} from '@ant-design/icons';

const Home = () => {
  const user = useUser({ redirectTo: '/login' })

  const [componentState, updateState] = useState({
    form: {},
    balance: user?.balance || 0,
    transactions: {},
    newTransaction: {},
  });


  const refreshTransactions = async () => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.status === 200) {
        const history = await res.json();
        history.transactions.sort(((a, b) => (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0)));
        updateState(produce(componentState, draftState => {
          draftState.transactions.isLoading = false;
          draftState.transactions.list = history.transactions.sort(((a, b) => b.createdAt < a.createdAt));
          draftState.isModalVisible = false;
        }));
      } else {
        if (user.id) {
          message.error('Failed to Get Transactions');
        }
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
    }
  }


  useEffect(async () => {
    if (!componentState.transactions.list) {
      await refreshTransactions();
    }
  }, []);


  const newTransaction = (value, name) => {
    console.log('Event: ', name, value);
    updateState(produce(componentState, draftState => {
        draftState.newTransaction[name] = value;
    }));
  }

  const showModal = () => {
    updateState(produce(componentState, draftState => {
      draftState.isModalVisible = true;
    }));
  };

  const handleOk = async () => {
    const transaction = componentState.newTransaction;
    console.log('Add Transaction: ', transaction);

    try {
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      })
      if (res.status === 200) {
        const latest = await res.json();
        console.log('New Transaction is: ', );
        updateState(produce(componentState, draftState => {
          draftState.isModalVisible = false;
          draftState.newTransaction = {};
          draftState.balance = latest.account.balance;
        }));
        message.success('Transaction Added.');
        await refreshTransactions();
      } else {
        message.error('Failed to Submit Transaction.');
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(error.message)
    }
  };

  const handleCancel = () => {
    updateState(produce(componentState, draftState => {
      draftState.isModalVisible = false;
    }));
  };

  return (
    <Layout>
      <Card title={`${user?.name} - Welcome to Mode Personal Banking!`}>
        <Card type="inner" title="Account details" extra={<Button type='primary'><Link href='/profile'><a><UserOutlined />&nbsp;My Account</a></Link></Button>}>
          Balance: {user?.balance} <PoundCircleOutlined />
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title="Recent Transactions"
          extra={
            <Button type='primary' onClick={showModal}>
                  <SendOutlined />
                    &nbsp;Add Transaction
              </Button>}
        >
          {componentState.transactions.isLoading ? (<Spin size="large" />) : (
            <TransactionHistory data={componentState.transactions.list} />
            )}
        </Card>
      </Card>
      <Modal title="Basic Modal" visible={componentState.isModalVisible} onOk={handleOk} okButtonProps={{disabled:false}}  onCancel={handleCancel}>
            <TransactionAdd handleChange={newTransaction}/>
      </Modal>

      <style jsx>{`
        li {
          margin-bottom: 0.5rem;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </Layout>
  )
}

export default Home
