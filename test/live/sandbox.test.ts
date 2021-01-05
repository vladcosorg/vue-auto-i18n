import { GoogleFreeTranslation } from '@/service/google-free-translation'
import * as util from 'util'

// test.skip('Live cloud', async () => {
//   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   // const api = new TranslationApi(process.env.GOOGLE_API_KEY!)
//   const result = await api.translate('ro', {
//     // test: (context) => 'hi',
//     travel: 'Travel from {origin} to {destination}',
//     return: 'Returning from <b>{origin}</b> to <b>{destination}</b>',
//     // allowed:
//     //   'is <b class=notranslate>@.lower:restriction.travel.value.allowed</b> without any restrictions. ',
//   })
//   expect(result).not.toBeFalsy()
// })

test.skip('Live free', async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const api = new GoogleFreeTranslation()
  const result = await api.translate('fr', {
    status: {
      allowed: 'Allowed',
      forbidden: 'Forbidden',
      conditional: 'Conditional',
    },

    intro: {
      title: 'I want to travel',
      btn: 'Search',
    },
    description: {
      intro: {
        travel: 'Travel from {origin} to {destination} ',
        return: 'Returning from <b>{origin}</b> to <b>{destination}</b>',
      },
      status: {
        allowed:
          'is @.lower:restriction.travel.value.allowed without any restrictions. ',
        forbidden:
          'is @.lower:restriction.travel.value.forbidden with some exceptions. Please consult the country page for more info. ',
        conditional:
          'is allowed with some conditions. Please consult the country page for more info.',
      },
      testing: {
        true: 'COVID test is required at entry.',
        false: 'COVID test is not required.',
      },
      insurance: {
        true:
          'Purchasing or owning an insurance that would cover COVID-19 treatment is necessary.',
        false: '',
      },
    },
    restriction: {
      updated: {
        label: 'Updated {days} days ago',
      },
      travel: {
        label: 'Travel',
        value: {
          allowed: 'Allowed',
          forbidden: 'Forbidden',
          conditional: 'Conditional',
        },
        badgeValue: {
          allowed: 'Entry Allowed',
          forbidden: 'Entry Forbidden',
          conditional: 'Entry Conditional',
        },
      },
      testing: {
        label: 'COVID test',
        value: {
          true: 'Required',
          false: 'Not needed',
        },
      },
      insurance: {
        label: 'Additional Health Insurance',
        value: {
          true: 'Required',
          false: 'Not needed',
        },
      },
      selfIsolation: {
        label: 'Self-isolation',
        days: '{number} days',
        staticValue: {
          true: 'Required',
          false: 'Not needed',
        },
      },
      healthDeclaration: {
        label: 'Health Declaration',
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        value: {
          true: 'Required',
          false: 'Not needed',
        },
      },
    },
    meta: {
      title: 'updated {date}',
      description:
        'Get the latest recommendations for international travel from {country}. We provide info on all travel warnings, exceptions, lifted bans, closed borders and temporary flight restriction end dates. Be aware of any PCR tests and COVID-19 vaccine passports that may be required at the border.',
    },
    page: {
      index: {
        route: 'from',
        hero: 'Coronavirus Travel Advisory for {country} citizens',
        meta: {
          title:
            'COVID-19 flight & travel bans to foreign countries for {nationality}',
        },
      },
      country: {
        route: 'travel/from',
        meta: {
          title:
            '{origin} COVID-19 Travel Restrictions and Bans Listed By Destination',
        },
        quickSearch: 'Quick country search',
        destinations: 'To Destinations',
        stats: {
          header: 'Quick stats',
          country: 'country|countries',
          values: {
            allowed: 'No limitations',
            conditional: 'Some limitations',
            forbidden: 'Entry forbidden',
          },
        },
      },
      destination: {
        route: 'to',
        meta: {
          title:
            '{destination} travel restrictions from {origin}: flight restrictions, quarantine measures,  COVID-19 vaccine passport  and other entry requirements',
        },
        title:
          'Latest information on travelling from {origin} to {destination}',
        seeReturnPage: 'See return travel',
        backToList: 'Back to list',
        returnWay: 'Return way',
        fillDeclaration: 'Fill online',
      },
      notFound: {
        title: '404',
        subtitle: 'Oops. Nothing here...',
      },
    },
    components: {
      theCountryList: {
        title: 'I want to travel',
        titleIntro: 'Or try another country',
        from: 'From',
        to: 'To',
        btn: 'Search',
      },
      subscribe: {
        action: 'Subscribe',
        actionDone: 'Subscribed',
        notification: 'You have been successfully subscribed',
        invalidEmailWarning: 'Please provide a valid email',
        title: 'Subscribe for notifications',

        subtitle: {
          origin:
            'Get notified when any restrictions are added or liften to any destinations from {origin}',
          destination: {
            isForbidden:
              'Get notified once the restrictions are lifted on the route {origin} → {destination}',
            isAllowed:
              'Get notified in case of any travel restrictions on the route {origin} → {destination}',
          },
        },
        placeholder: 'Please enter your email',
        close: 'Close',
      },
      destinationItem: {
        titleWithDirection: '{from} → {to}',
        readMore: 'Read more',
        ssrAttrTitle: 'See COVID-19 travel restrictions to {to}',
        ssrTitle: 'Travel restrictions for travel from {from} to {to}',
        riskLevel: {
          title: 'COVID-19 Risk Level',
          values: {
            'no-data': 'No data',
            low: 'Low',
            moderate: 'Moderate',
            high: 'High',
            'very-high': 'Very high',
          },
        },
      },
      footer: {
        languages: 'Languages',
        lastUpdated: 'Last updated on <br><b>{date}</b>',
        disclaimer:
          'Our website offers up-to-date information on flight restrictions,  travel bans, quarantine measures,  COVID-19 vaccine passport and other entry requirements, border closures due to coronavirus pandemic. We do our best to keep the information update but let us know if something needs correction.  Wherever you’re flying from, please always check government advice before booking.',
      },
    },
    misc: {
      countryCitizen: '{country} citizens',
    },
  })
  console.log(util.inspect(result, false, null, true /* enable colors */))
  expect(result).not.toBeFalsy()
})
