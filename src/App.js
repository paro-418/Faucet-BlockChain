import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

import { loadContract } from './utils/loadContract.js';
import './App.css';

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, setShouldReload] = useState(false);

  const canConnectToContract = account && web3Api.contract;
  const reloadEffect = useCallback(
    () => setShouldReload(!shouldReload),
    [shouldReload]
  );

  const accountChangeListener = (provider) => {
    provider.on('accountsChanged', (_) => window.location.reload());
    provider.on('chainChanged', (_) => window.location.reload());
    // provider._jsonRpcConnection.events.on('notification', (payload) => {
    //   const { method } = payload;
    //   if (method === 'metamask_unlockStateChanged') {
    //     setAccount(null);
    //   }
    // });
  };

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const provider = await detectEthereumProvider();
        // console.log(contract);
        // debugger;
        if (provider) {
          // console.log('running');
          const contract = await loadContract('Faucet', provider);
          accountChangeListener(provider);
          setWeb3Api({
            provider,
            web3: new Web3(provider),
            contract,
          });
        } else {
          console.log('Please install metamask');
        }
      } catch (error) {
        console.log('error', error);
      }
      // let provider = null;
      // if (window.ethereum) {
      //   provider = window.ethereum;
      //   try {
      //     await provider.request({ method: 'eth_requestAccounts' });
      //   } catch (error) {
      //     console.log('User denied account access', error);
      //   }
      // } else if (window.web3) {
      //   provider = window.web3.currentProvider;
      // } else if (!process.env.production) {
      //   provider = new Web3.providers.HttpProvider('http://localhost:7545');
      // }
      // setWeb3Api({
      //   provider,
      //   web3: new Web3(provider),
      // });
      // console.log(web3Api);
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      // console.log(accounts);
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      // console.log(contract);
      const balance = await web3.eth.getBalance(contract.address);
      // console.log(balance);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    };

    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei('1', 'ether'),
    });

    // window.location.reload();
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdrawFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.withdraw(web3.utils.toWei('0.1', 'ether'), {
      from: account,
    });
    reloadEffect();
  }, [account, web3Api, reloadEffect]);
  return (
    <>
      <div className='faucet-wrapper'>
        <div className='faucet'>
          <div>
            <strong>Account:</strong>{' '}
          </div>

          {account ? (
            <div> {account}</div>
          ) : !web3Api.provider ? (
            <>
              <div className='notification is-warning is-rounded'>
                wallet is not detected!
                <a
                  href='https://docs.metamask.io'
                  target='_blank'
                  rel='noreferrer'
                >
                  Install Metamask
                </a>
              </div>
            </>
          ) : (
            <button
              className='button is-info  mr-2'
              onClick={() =>
                web3Api.provider.request({ method: 'eth_requestAccounts' })
              }
            >
              Connect Wallet
            </button>
          )}

          <div className='balance-view is-size-2'>
            Current Contract Balance: <strong>{balance} ETH</strong>
          </div>
          {!canConnectToContract && (
            <i className='is-block '>Connect to ganache</i>
          )}
          {/* <button
            className='btn mr-2'
            onClick={async () => {
              const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
              });
              console.log(accounts);
            }}
          >
            Enable Ethereum
          </button> */}
          <button
            disabled={!canConnectToContract}
            className='button is-link  mr-2'
            onClick={addFunds}
          >
            Donate 1 Eth
          </button>
          <button
            disabled={!canConnectToContract}
            className='button mr-2 is-primary '
            onClick={withdrawFunds}
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
