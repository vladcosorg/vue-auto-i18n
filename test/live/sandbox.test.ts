import { GoogleCloud } from '../../src/translation-service/google-cloud'
import { GoogleFree } from '../../src/translation-service/google-free'

// eslint-disable-next-line jest/no-disabled-tests
test.skip('Live cloud', async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const api = new GoogleCloud(process.env.GOOGLE_API_KEY!)
  const result = await api.translate('ro', {
    // test: (context) => 'hi',
    travel: 'Travel from {origin} to {destination}',
    return: 'Returning from <b>{origin}</b> to <b>{destination}</b>',
    rs: {
      forbidden: [
        'Tourists arriving from <i id="origin">Moldova</i>, are prohibited from entering.',
      ],
      noRestrictions: [
        'Tourists arriving from <i id="origin">Moldova</i> are allowed to enter without restriction, according to the embassy.',
        'For now, the country is open without restrictions.',
        'The citizens  are allowed to enter without restriction, according to the U.S. Embassy in Colombia.',
        'The country is open with no testing and no quarantine mandate.',
      ],
      onlyVaccinated: [
        'Visitors to the <i id="destination">Moldova</i> who have been vaccinated can enter without restriction, but may be selected for random testing on arrival. ',
        'The country is open to <i id="origin">Moldova</i> citizens and permanent residents who currently reside in <i id="origin">Moldova</i> if they have proof of full vaccination.',
        'Travelers with proof of vaccination may enter without restriction. ',
        'Those with proof of full vaccination  do not need to be tested or quarantined.',
        'Travelers with proof of vaccination may enter without restriction.',
        'People who have been vaccinated do not need to test. No other restrictions upon arrival.',
        'Travelers are asked to present proof of being vaccinated, no other restrictions are in force.',
        'Vaccinated passengers who have completed their full vaccinations before traveling, may enter without testing or quarantine.',
      ],
      onlyVaccinatedAndTestedBeforeFlight: [
        'Those who are fully vaccinated need to provide either a negative test taken before arrival.',
        'Adult visitors may enter with proof of full vaccination and a coronavirus test taken before the flight.',
        'Vaccinated tourists traveling to <i id="destination">Moldova</i> will need proof of a negative pretest before arrival.',
        'Vaccinated citizens of <i id="destination">Moldova</i> are allowed to enter by air with proof of a negative test performed before arrival. ',
      ],
      onlyVaccinatedAndTestedAfterFlightWithQuarantine: [
        'Those who are fully vaccinated need to provide either a negative test taken before arrival. They will be given a test upon arrival, and need to quarantine until a negative result is received.',
      ],
      onlyVaccinatedAndTestedBeforeAfterFlightWithQuarantine: [
        'Travelers need a negative test taken before arrival, and an additional test will be given on arrival. Travelers must stay on the property of their accommodation until they receive a negative result.',
      ],
      onlyVaccinatedAndQuarantine: ['onlyVaccinatedAndQuarantine'],
      onlyTestedBeforeFlight: [
        '<i id="destination">Moldova</i> is requiring all visitors, whether they are vaccinated or not, to have a negative result to a coronavirus test before departure',
        'Entry by air is permitted and visitors are required to present a negative test taken before arrival.',
        'Visitors must present a negative test upon arrival, regardless of vaccination status.',
        'Passengers must have a negative laboratory test taken before their flight.',
        'Adults traveling to <i id="destination">Moldova</i>, whether fully vaccinated or not, will need proof of a negative pretest before arrival.',
        'Air travelers must provide a certificate of a negative test taken before arrival',
        'Before departure for <i id="destination">Moldova</i>, passengers must peform a coronavirus test with a negative result. ',
        'Regardless of vaccination status, visitors must show a negative test taken before travel.',
      ],
      onlyTestedBeforeFlightWithQuarantine: [
        'A negative coronavirus test is required to enter, followed by a quarantine for tourists.',
        'Visitors must have a negative PCR test taken before departure. A mandatory quarantine is required after arrival.',
      ],
      onlyTestedAfterFlightWithQuarantine: [
        'No coronavirus pretest is required for entry, but a rapid test will be given upon arrival.',
      ],
      onlyTestedBeforeAndAfterFlightWithQuarantine: [
        'Travelers must arrive with proof of a negative coronavirus test. Another test will be given at the airport and people must self-quarantine until they receive a negative result.',
        'Visitors from <i id="destination">Moldova</i> may enter with proof of a negative test taken before departure, and will also be given a test upon landing.',
        'Visitors must have proof of a negative virus test taken before boarding their flight for <i id="destination">Moldova</i>. Upon landing, travelers are given another test. ',
      ],
      onlineApplication: [
        'However, they will have to complete a Passenger Locator Form and submit to health screenings at the airport.',
        'Travelers must also fill out a Travel Registration Form and abide by screenings to enter.',
      ],
      insurance: {
        vaccinated: [],
        unvaccinated: [
          'All visitors must purchase mandatory insurance.',
          'Proof of health insurance is required.',
          'Visitors must have health insurance that covers illness from the coronavirus.',
          'Mandatory insurance that covers medical and other expenses related to the coronavirus is required for unvaccinated tourists.',
        ],
      },

      vaccinated: {
        noRestrictions: [],
        testing: {
          true: [
            'Travelers with proof of vaccination and those who have a doctor’s certificate saying that they have recovered from Covid-19 in the previous 14 to 180 days may enter without restriction. ',
          ],
          false: [
            'Vaccinated visitors can enter with just a test taken 72 hours before arrival. ',
          ],
        },
        quarantine: {
          true: [
            'A 10-day quarantine for all arriving visitors is also required.',
          ],
          false: [
            'There are no quarantine requirements nor travel restrictions within the country.',
            'Once in <i id="destination">Moldova</i> , there are no quarantine requirements for <i id="country">Moldova</i> citizens, curfews or restrictions on interstate travel. ',
            'Vaccinated travelers can bypass quarantine',
            'Once in the country, you will be subject to temperature testing but won’t be required to quarantine.',
          ],
        },
      },

      more: [
        'For more information, visit the this page {1}.',
        'Visit this page to learn more about <i id="destination">Moldova</i> entry and exit requirements.',
        'Visit the <i id="destination">Moldova</i> info page for more information regarding traveling during the pandemic.',
        'Additional information is available on the <i id="destination">Moldova</i> info page, which outlines specifics for travelers.',
        'Keep tabs on updates via the this information page.',
        'For the most up to date information, visit <i id="link">this page</i>.',
        'Visit <i id="link">this page</i> for the most up-to-date information.',
        'For more information, head to this page.',
        'Learn more by visiting this page.',
        'The <i id="link">latest visitor information is available here</i>',
        'Learn more about protocols in <i id="destination">Moldova</i> on <i id="link">this page</i>.',
        'Learn more about the current  <i id="destination">Moldova</i> COVID-19 protocols on <i id="link">this page</i>.',
        'Learn more about what your trip to  <i id="destination">Moldova</i> will look like <i id="link">here</i>.',
        'Find out more on the <i id="destination">Moldova</i> entry protocol page.',
        'See up-to-date information on the <i id="destination">Moldova</i> <i id="link">this page</i>.',
        'Learn more about the rules applying to specific travelers on <i id="link">this page</i>.',
        'For the latest information, visit this page.',
        'Learn more on the dedicated <i id="destination">Moldova</i> page.',
        'Stay up to date on the regulations – which are reviewed regularly – by visiting <i id="link">this page</i>.',
        'For more information about <i id="destination">Moldova</i> policies, visit this page.',
        'Visit the embassy website for more travel specifics.',
        'The <i id="country">Moldova</i> information page is frequently updated with information regarding entry.',
      ],
    },
    // allowed:
    //   'is <b class=notranslate>@.lower:restriction.travel.value.allowed</b> without any restrictions. ',
  })
  console.log(result)
  expect(result).not.toBeFalsy()
})
// eslint-disable-next-line jest/no-disabled-tests
test.skip('Live free', async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const api = new GoogleFree()
  const result = await api.translate('fr', {
    status: {
      allowed: 'Allowed',
      forbidden: 'Forbidden',
      conditional: 'Conditional',
    },
  })
  expect(result).not.toBeFalsy()
})
