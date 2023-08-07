import contract from '@truffle/contract';

export const loadContract = async (name, provider) => {
  const res = await fetch(`/contracts/${name}.json`);
  // console.log(res);
  const Artifact = await res.json();
  // console.log(Artifact);
  // console.log(contract(Artifact));
  const _contract = contract(Artifact);
  _contract.setProvider(provider);
  let deployedContract;

  try {
    deployedContract = await _contract.deployed();
  } catch (error) {
    console.log(
      'Can not load contract OR you might have connected to wrong network',
      error
    );
  }

  return deployedContract;
};
