import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

// Sample JSON data (replace with your actual JSON data)
const jsonData = {
  "projects": [
    {
      "id": "11180",
      "display_name": "Whale Chat",
      "classifications_count": 3024,
      "updated_at": "2023-09-24T04:18:53.812Z",
      "description": "Identification and classification of humpback whale vocalizations",
      "slug": "cetalingua/whale-chat",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.0,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/09a99165-8f7b-4293-9ee6-f2ecef1d1a3a.png",
      "links": {}
    },
    {
      "id": "9006",
      "display_name": "Davy Notebooks Project",
      "classifications_count": 1485,
      "updated_at": "2023-09-24T04:18:03.939Z",
      "description": "Help us to transcribe the manuscript notebooks of Sir Humphry Davy – one of the most significant and famous figures in the scientific and literary culture of early nineteenth-century Britain, Europe, and America.",
      "slug": "humphrydavy/davy-notebooks-project",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.5668,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/96bcc0b4-ab90-4ebe-abab-83a3129a70f3.jpeg",
      "links": {}
    },
    {
      "id": "8149",
      "display_name": "SquirrelMapper",
      "classifications_count": 152040,
      "updated_at": "2023-09-24T04:53:06.783Z",
      "description": "EVOLUTION IN YOUR BACKYARD  Classify squirrels to measure natural selection in action. Together we can crack this nut!",
      "slug": "bcosentino/squirrelmapper",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.5408,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/fd7e2a7b-a0e7-4ba5-91e0-3fc9a996dabe.jpeg",
      "links": {}
    },
    {
      "id": "14054",
      "display_name": "Spyfish Aotearoa",
      "classifications_count": 20427,
      "updated_at": "2023-09-24T04:22:26.780Z",
      "description": "Kia ora and welcome to Aotearoa New Zealand's underwater world! Discover, count and identify unique fish species from marine reserves.",
      "slug": "victorav/spyfish-aotearoa",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.7155,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/39e7b44e-cd72-4fa8-bb2e-46b95f06f7cf.png",
      "links": {}
    },
    {
      "id": "20446",
      "display_name": "SIREN project",
      "classifications_count": 1816,
      "updated_at": "2023-09-24T05:02:06.691Z",
      "description": "Help us saving Italian hydrological measurements, don't stop the (data) flow!",
      "slug": "siren-project/siren-project",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.1406,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/cfd5e4ec-a881-4f20-8502-c6e42eedea47.jpeg",
      "links": {}
    },
    {
      "id": "12614",
      "display_name": "Nest Quest Go: Grackles",
      "classifications_count": 74723,
      "updated_at": "2023-09-24T04:29:16.314Z",
      "description": "Boisterous callers, grackles are a fascinating group of birds. Help transcribe nest record cards to learn more about them.",
      "slug": "brbcornell/nest-quest-go-grackles",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.901,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/7b12e444-0a9d-409c-bac9-c85233c32638.jpeg",
      "links": {}
    },
    {
      "id": "21001",
      "display_name": "Kilonova Seekers",
      "classifications_count": 325720,
      "updated_at": "2023-09-24T05:03:34.898Z",
      "description": "Find cosmic explosions in real-time with the Gravitational-wave Optical Transient Observer (GOTO) - new data uploaded daily!",
      "slug": "tkillestein/kilonova-seekers",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.9843,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/34c8e55c-f4ee-4195-b68e-b7015270b222.png",
      "links": {}
    },
    {
      "id": "18801",
      "display_name": "Backyard Worlds: Cool Neighbors",
      "classifications_count": 532493,
      "updated_at": "2023-09-24T04:51:13.753Z",
      "description": "Searching for brown dwarfs, cool neighbors of our Sun.",
      "slug": "coolneighbors/backyard-worlds-cool-neighbors",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.017,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/2becf99d-7f9d-4699-9111-f481d41484b3.png",
      "links": {}
    },
    {
      "id": "15533",
      "display_name": "Shadows on Stone: Identifying Sing Sing's Incarcerated",
      "classifications_count": 1699,
      "updated_at": "2023-09-24T04:35:03.557Z",
      "description": "Uncover the hidden histories of those incarcerated at Sing Sing Prison from 1865-1925 by transcribing the hand-written admission registers.",
      "slug": "panettafordham/shadows-on-stone-identifying-sing-sings-incarcerated",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.1022,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/86063d37-dea5-458e-9836-02473226e461.jpeg",
      "links": {}
    },
    {
      "id": "10996",
      "display_name": "Superluminous Supernovae",
      "classifications_count": 64746,
      "updated_at": "2023-09-24T04:07:32.363Z",
      "description": "Can you find the brightest supernovae in the Universe?",
      "slug": "mrniaboc/superluminous-supernovae",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.9661,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/660d2df6-f122-4cc5-99ec-ad4069e7c494.jpeg",
      "links": {}
    },
    {
      "id": "13175",
      "display_name": "Redshift Wrangler",
      "classifications_count": 62800,
      "updated_at": "2023-09-24T04:23:01.025Z",
      "description": "Help us use the light from distant galaxies to look back in time to the early universe!",
      "slug": "jeyhansk/redshift-wrangler",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.067,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/18afac14-642e-4f1a-938d-a1fc2efccd2d.png",
      "links": {}
    },
    {
      "id": "19413",
      "display_name": "The Daily Minor Planet",
      "classifications_count": 124964,
      "updated_at": "2023-09-24T04:11:37.407Z",
      "description": "Discover new asteroids every day!",
      "slug": "fulsdavid/the-daily-minor-planet",
      "redirect": "",
      "launch_approved": true,
      "completeness": 0.0375,
      "state": "live",
      "avatar_src": "https://panoptes-uploads.zooniverse.org/project_avatar/dca890f4-6496-4b5a-bc35-1db3c2bcdc0a.png",
      "links": {}
    },
   
  ]
};

// Function to render a single project card
const renderProjectCard = (project) => (
  <View style={styles.card} key={project.id}>
    <Image source={{ uri: project.avatar_src }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{project.display_name}</Text>
      <Text>{project.description}</Text>
      <Text>Classifications Count: {project.classifications_count}</Text>
      {/* Add more project details as needed */}
    </View>
  </View>
);

const Revelent = () => {
  return (
    <ScrollView style={styles.container}>
      {jsonData.projects.map((project) => renderProjectCard(project))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:30,
    backgroundColor: '#f0f0f0', // Background color for the entire page
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Add more styling as needed
});

export default Revelent;