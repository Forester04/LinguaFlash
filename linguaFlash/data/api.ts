import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_STORAGE_KEY = 'userid';

//
// INTERFACES
//
export interface Set {
  cards: number;
  description: string;
  creator: string;
  id: string;
  title: string;
  image?: any;
}

export interface Card {
  answer: string;
  id: string;
  question: string;
  image?: any;
  set: string;
}

//
// SET CALLS
//
export const createSet = async (set: Partial<Set>) => {
  const user = await AsyncStorage.getItem(USER_STORAGE_KEY);

  try {
    const response = await fetch('https://76be-105-160-117-82.ngrok-free.app/sets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...set, creator: user }),
    });

    if (!response.ok) {
      throw new Error('Network request failed');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating set:', error);
    throw error;
  }
};

export const getSets = async (): Promise<Set[]> => {
  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/sets`);
  return response.json();
};

export const deleteSet = async (setid: string) => {
  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/sets/${setid}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const getMySets = async (): Promise<{ id: string; set: Set; canEdit: boolean }[]> => {
  const user = await AsyncStorage.getItem(USER_STORAGE_KEY);

  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/usersets?user=${user}`);
  const data = await response.json();
  return data.map((item: any) => ({ ...item, canEdit: item.set.creator === user }));
};

export const getSet = async (id: string): Promise<Set> => {
  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/sets/${id}`);
  return response.json();
};

export const addToFavorites = async (set: string) => {
  const user = await AsyncStorage.getItem(USER_STORAGE_KEY);

  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/usersets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, set }),
  });
  return response.json();
};

//
// CARDS CALLS
//
export const getLearnCards = async (setid: string, limit: string) => {
  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/cards/learn?setid=${setid}&limit=${limit}`);
  return response.json();
};

export const getCardsForSet = async (setid: string) => {
  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/cards?setid=${setid}`);
  return response.json();
};

export const createCard = async (card: Partial<Card>) => {
  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(card),
  });
  return response.json();
};

//
// LEARNINGS CALLS
//

export const saveLearning = async (
  setid: string,
  cardsTotal: number,
  correct: number,
  wrong: number
) => {
  const user = await AsyncStorage.getItem(USER_STORAGE_KEY);

  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/learnings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, set: setid, cardsTotal, correct, wrong }),
  });
  return response.json();
};

export const getUserLearnings = async () => {
  const user = await AsyncStorage.getItem(USER_STORAGE_KEY);

  const response = await fetch(`https://76be-105-160-117-82.ngrok-free.app/learnings?user=${user}`);
  return response.json();
};