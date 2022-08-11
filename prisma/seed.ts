

import axios from 'axios';
import cheerio from 'cheerio';
import 'dotenv/config';
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getCharacterInfo = async (characterName: string): Promise<Prisma.tog_characterCreateInput> => {
    const { data } = await axios.get(`https://throneofglass.fandom.com/wiki/${characterName}`);
    const $ = cheerio.load(data);
    let name = $('div[data-source="full name"] > div.pi-data-value.pi-font').text();
    const species = $('div[data-source="species"] > div.pi-data-value.pi-font').text();
    const image = $('.image.image-thumbnail > img').attr('src');
    if (!name) {
        const parts = characterName.split('/');
        const last = parts[parts.length - 1];
        name = last.replace('_', ' ');
    }
    const characterInfo: Prisma.tog_characterCreateInput = {
        name,
        species,
        image,
    };
    return characterInfo;
};

const loadCharacters = async () => {
    try {

        const characterInfoPromises = characterNames
            .map((characterName) => getCharacterInfo(characterName));
        const characters: Prisma.tog_characterCreateInput[] = await Promise.all(characterInfoPromises);
        console.log("🚀 ~ file: seed.ts ~ line 138 ~ loadCharacters ~ characters", characters)
        // save them to the db
        console.log("Let's seed it");
        await prisma.tog_character.createMany({ data: characters });
    } catch (error) {
        console.error(error)
    }
};

const characterNames = [
    'Abraxos',
    'Aedion_Ashryver',
    'Aelin_Galathynius',
    'Anneith',
    'Ansel_of_Briarcliff',
    'Asterin_Blackbeak',
    'Blackbeak_Matron',
    'Borte',
    'Briar_Blackbeak',
    'Bronwen_Vanora',
    'Cadre',
    'Cairn',
    'Chaol_Westfall',
    'Connall',
    'Cresseida_Blueblood',
    'Crochan_Witches',
    'Cyrene',
    'Deanna',
    'Dorian_Havilliard',
    'Dorian_Havilliard_I',
    'Dresenda',
    'Duke_Perrington',
    'Edda_Blackbeak',
    'Elena_Galathynius_Havilliard',
    'Elgan',
    'Elide_Lochan',
    'Endymion_Whitethorn',
    'Erawan',
    'Essar',
    'Evangeline',
    'Fae',
    'Faline_Blackbeak',
    'Falkan_Ennar',
    'Fallon_Blackbeak',
    'Farasha',
    'Farnor',
    'Fendir',
    'Fenrys_Moonbeam',
    'Fleetfoot',
    'Galan_Ashryver',
    'Gavriel',
    'Ghislaine_Blackbeak',
    'Glennis_Crochan',
    'Hasar',
    'Hellas',
    'Human',
    'Ilias',
    'Ilken',
    'Imogen_Blackbeak',
    'Kaltain_Rompier',
    'Kaya_Blackbeak',
    'Keva',
    'Kharankui',
    'Kyllian',
    'Lady_of_the_Great_Deep',
    'Linnea_Blackbeak',
    'Lorcan_Salvaterre',
    'Lord_Westfall',
    'Lumas',
    'Lysandra',
    'Maeve',
    'Mala_Fire-Bringer',
    'Manon_Blackbeak',
    'Murtaugh_Allsbrook',
    'Nesryn_Faliq',
    'Ren_Allsbrook',
    'Rolfe',
    'Rowan_Whitethorn',
    'Ruk',
    'Sartaq',
    'Sellene_Whitethorn',
    'Sorrel_Blackbeak',
    'Temis',
    'The_Bane',
    'The_Lord_of_the_North',
    'The_Silent_Assassins',
    'The_Thirteen',
    'Thea_Blackbeak',
    'Three-Faced_Goddess',
    'Vernon_Lochan',
    'Vesta_Blackbeak',
    'Weylan_Darrow',
    'Yellowlegs_Matron',
    'Yeran',
    'Yrene_Westfall',
];

loadCharacters();