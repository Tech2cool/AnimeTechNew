import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {ToastAndroid} from 'react-native';
const tableName = 'anime_watchList';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'anime-MyList.db', location: 'default'});
};

export const createTable = async db => {
  // create table if not exists
  const query = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id TEXT PRIMARY KEY,
      episodeIdGogo TEXT,
      episodeIdAniwatch TEXT,
      episodeIdAnilist TEXT,
      episodeNum TEXT,
      english TEXT,
      english_jp TEXT,
      japanese TEXT,
      animeImg TEXT,
      currentTime TEXT,
      duration TEXT,
      aniwatchId TEXT,
      gogoId TEXT,
      anilistId TEXT,
      malId TEXT,
      kitsuId TEXT,
      timestamp TEXT,
      wannaDelete TEXT,
      provider TEXT
    );
  `;

  await db.executeSql(query);
};

export const getManyItems = async db => {
  try {
    const items = [];
    await createTable(db);
    const results = await db.executeSql(`SELECT * FROM ${tableName}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        items.push(result.rows.item(index));
      }
    });
    return items;
  } catch (error) {
    console.error(error);
    // throw Error('Failed to get items !!!');
  }
};

export const saveVideoRecord = async (db, record) => {
  const {id} = record;
  try {
    await createTable(db);
    const results = await db.executeSql(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id],
    );

    if (results.length > 0) {
      if (results[0]?.rows.length > 0) {
        await updateQuery(db, record);
      } else {
        await insertQuery(db, record);
      }
    } else {
      console.log('table not exist');
      await createTable(db);
      console.log('new table created named: ' + tableName);
    }
  } catch (error) {
    ToastAndroid.show(`table not exist`, ToastAndroid.SHORT);
    await createTable(db);
    ToastAndroid.show(
      `new table created named:  ${tableName}`,
      ToastAndroid.SHORT,
    );
  }
};

const insertQuery = async (db, record) => {
  const {
    id,
    episodeIdGogo,
    animeImg,
    episodeIdAniwatch,
    episodeIdAnilist,
    english,
    english_jp,
    japanese,
    episodeNum,
    currentTime,
    duration,
    aniwatchId,
    gogoId,
    anilistId,
    malId,
    kitsuId,
    timestamp,
    wannaDelete,
    provider,
  } = record;

  try {
    await createTable(db);
    // Insert new record
    const insertQuery = `INSERT OR REPLACE INTO ${tableName} 
  (id, episodeIdGogo, episodeIdAniwatch, episodeIdAnilist, english, english_jp, japanese, 
  episodeNum, currentTime, duration, aniwatchId, gogoId, anilistId, malId, kitsuId, timestamp, 
  wannaDelete, provider,animeImg) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const insertParams = [
      id,
      episodeIdGogo,
      episodeIdAniwatch,
      episodeIdAnilist,
      english,
      english_jp,
      japanese,
      episodeNum,
      currentTime,
      duration,
      aniwatchId,
      gogoId,
      anilistId,
      malId,
      kitsuId,
      timestamp,
      wannaDelete,
      provider,
      animeImg,
    ];

    // Execute the insert query
    await db.executeSql(insertQuery, insertParams);
    // console.log('Record inserted successfully');
  } catch (error) {
    console.log(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  }
};

const updateQuery = async (db, record) => {
  const {
    id,
    episodeIdGogo,
    animeImg,
    episodeIdAniwatch,
    episodeIdAnilist,
    english,
    english_jp,
    japanese,
    episodeNum,
    currentTime,
    duration,
    aniwatchId,
    gogoId,
    anilistId,
    malId,
    kitsuId,
    timestamp,
    wannaDelete,
    provider,
  } = record;

  try {
    let updateQuery = `UPDATE ${tableName} SET`;
    const updateParams = [];

    // Build the SET clause dynamically based on defined fields
    const fieldsToUpdate = [
      {name: 'episodeIdGogo', value: episodeIdGogo},
      {name: 'episodeIdAniwatch', value: episodeIdAniwatch},
      {name: 'episodeIdAnilist', value: episodeIdAnilist},
      {name: 'english', value: english},
      {name: 'english_jp', value: english_jp},
      {name: 'japanese', value: japanese},
      {name: 'animeImg', value: animeImg},
      {name: 'episodeNum', value: episodeNum},
      {name: 'currentTime', value: currentTime},
      {name: 'duration', value: duration},
      {name: 'aniwatchId', value: aniwatchId},
      {name: 'gogoId', value: gogoId},
      {name: 'anilistId', value: anilistId},
      {name: 'malId', value: malId},
      {name: 'kitsuId', value: kitsuId},
      {name: 'timestamp', value: timestamp},
      {name: 'wannaDelete', value: wannaDelete},
      {name: 'provider', value: provider},
    ];

    const filteredFieldsToUpdate = fieldsToUpdate.filter(
      field => field.value !== undefined && field.value !== null,
    );

    filteredFieldsToUpdate.forEach((field, index) => {
      updateQuery += ` ${field.name} = ?`;
      updateParams.push(field.value);
      if (index < filteredFieldsToUpdate.length - 1) {
        updateQuery += ',';
      }
    });

    updateQuery += ` WHERE id = ?`;
    updateParams.push(id);

    // Execute the update query
    await db.executeSql(updateQuery, updateParams);
    // console.log('Record updated successfully');
  } catch (error) {
    console.log(error);
    ToastAndroid.show(error, ToastAndroid.SHORT);
  }
};

export const deleteOneItem = async (db, id, value) => {
  const deleteQuery = `DELETE from ${tableName} where ${id} = ${value}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async db => {
  const query = `drop table ${tableName}`;
  await createTable(db);

  await db.executeSql(query);
};
