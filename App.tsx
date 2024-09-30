/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import * as SQLite from 'expo-sqlite';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    async function initDB() {
      const db = await SQLite.openDatabaseAsync('test.db');

      // `execAsync()` is useful for bulk queries when you want to execute altogether.
      // Please note that `execAsync()` does not escape parameters and may lead to SQL injection.
      await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
INSERT INTO test (value, intValue) VALUES ('test1', 123);
INSERT INTO test (value, intValue) VALUES ('test2', 456);
INSERT INTO test (value, intValue) VALUES ('test3', 789);
`);

      // `runAsync()` is useful when you want to execute some write operations.
      const result = await db.runAsync(
        'INSERT INTO test (value, intValue) VALUES (?, ?)',
        'aaa',
        100,
      );
      console.log(result.lastInsertRowId, result.changes);
      await db.runAsync(
        'UPDATE test SET intValue = ? WHERE value = ?',
        999,
        'aaa',
      ); // Binding unnamed parameters from variadic arguments
      await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [
        999,
        'aaa',
      ]); // Binding unnamed parameters from array
      await db.runAsync('DELETE FROM test WHERE value = $value', {
        $value: 'aaa',
      }); // Binding named parameters from object

      // `getFirstAsync()` is useful when you want to get a single row from the database.
      const firstRow = await db.getFirstAsync('SELECT * FROM test');
      console.log(firstRow.id, firstRow.value, firstRow.intValue);

      // `getAllAsync()` is useful when you want to get all results as an array of objects.
      const allRows = await db.getAllAsync('SELECT * FROM test');
      for (const row of allRows) {
        console.log(row.id, row.value, row.intValue);
      }

      // `getEachAsync()` is useful when you want to iterate SQLite query cursor.
      for await (const row of db.getEachAsync('SELECT * FROM test')) {
        console.log(row.id, row.value, row.intValue);
      }
    }

    initDB();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
