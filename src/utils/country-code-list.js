import _ from 'lodash';

var countryList = [
  {
    code: 'SM',
    name: 'San Marino'
  },
  {
    code: 'MX',
    name: 'Mexico'
  },
  {
    code: 'SN',
    name: 'Senegal'
  },
  {
    code: 'VI',
    name: 'Virgin Islands, U.S.'
  },
  {
    code: 'PS',
    name: 'Palestinian Territory, Occupied'
  },
  {
    code: 'SO',
    name: 'Somalia'
  },
  {
    code: 'PT',
    name: 'Portugal'
  },
  {
    code: 'YE',
    name: 'Yemen'
  },
  {
    code: 'BR',
    name: 'Brazil'
  },
  {
    code: 'MY',
    name: 'Malaysia'
  },
  {
    code: 'MZ',
    name: 'Mozambique'
  },
  {
    code: 'BS',
    name: 'Bahamas'
  },
  {
    code: 'BT',
    name: 'Bhutan'
  },
  {
    code: 'KE',
    name: 'Kenya'
  },
  {
    code: 'PW',
    name: 'Palau'
  },
  {
    code: 'NA',
    name: 'Namibia'
  },
  {
    code: 'SR',
    name: 'Suriname'
  },
  {
    code: 'HK',
    name: 'Hong Kong'
  },
  {
    code: 'VN',
    name: 'Vietnam'
  },
  {
    code: 'BV',
    name: 'Bouvet Island'
  },
  {
    code: 'KG',
    name: 'Kyrgyzstan'
  },
  {
    code: 'ST',
    name: 'Sao Tome and Principe'
  },
  {
    code: 'BW',
    name: 'Botswana'
  },
  {
    code: 'HM',
    name: 'Heard Island and McDonald Islands'
  },
  {
    code: 'PY',
    name: 'Paraguay'
  },
  {
    code: 'NC',
    name: 'New Caledonia'
  },
  {
    code: 'ER',
    name: 'Eritrea'
  },
  {
    code: 'KH',
    name: 'Cambodia'
  },
  {
    code: 'HN',
    name: 'Honduras'
  },
  {
    code: 'ES',
    name: 'Spain'
  },
  {
    code: 'KI',
    name: 'Kiribati'
  },
  {
    code: 'SV',
    name: 'El Salvador'
  },
  {
    code: 'ET',
    name: 'Ethiopia'
  },
  {
    code: 'BY',
    name: 'Belarus'
  },
  {
    code: 'NE',
    name: 'Niger'
  },
  {
    code: 'EU',
    name: 'Europe'
  },
  {
    code: 'QA',
    name: 'Qatar'
  },
  {
    code: 'BZ',
    name: 'Belize'
  },
  {
    code:'NF',
    name: 'Norfolk Island'
  },
  {
    code: 'NG',
    name: 'Nigeria'
  },
  {
    code: 'SY',
    name: 'Syrian Arab Republic'
  },
  {
    code: 'HR',
    name: 'Croatia'
  },
  {
    code: 'CA',
    name: 'Canada'
  },
  {
    code: 'KM',
    name: 'Comoros'
  },
  {
    code: 'SZ',
    name: 'Swaziland'
  },
  {
    code: 'NI',
    name: 'Nicaragua'
  },
  {
    code: 'KN',
    name: 'Saint Kitts and Nevis'
  },
  {
    code: 'VU',
    name: 'Vanuatu'
  },
  {
    code: 'HT',
    name: 'Haiti'
  },
  {
    code: 'KP',
    name: "Korea, Democratic People's Republic of"
  },
  {
    code: 'CD',
    name: 'Congo, The Democratic Republic of'
  },
  {
    code: 'HU',
    name: 'Hungary'
  },
  {
    code: 'NL',
    name: 'Netherlands'
  },
  {
    code: 'YT',
    name: 'Mayotte'
  },
  {
    code: 'TC',
    name: 'Turks and Caicos Islands'
  },
  {
    code: 'CF',
    name: 'Central African Republic'
  },
  {
    code: 'KR',
    name: 'Korea, Republic of'
  },
  {
    code: 'TD',
    name: 'Chad'
  },
  {
    code: 'CG',
    name: 'Congo'
  },
  {
    code: 'A1',
    name: 'Anonymous Proxy'
  },
  {
    code: 'NO',
    name: 'Norway'
  },
  {
    code: 'CH',
    name: 'Switzerland'
  },
  {
    code: 'A2',
    name: 'Satellite Provider'
  },
  {
    code: 'NP',
    name: 'Nepal'
  },
  {
    code: 'CI',
    name: "Cote D'Ivoire"
  },
  {
    code: 'TG',
    name: 'Togo'
  },
  {
    code: 'NR',
    name: 'Nauru'
  },
  {
    code: 'TH',
    name: 'Thailand'
  },
  {
    code: 'CK',
    name: 'Cook Islands'
  },
  {
    code: 'KW',
    name: 'Kuwait'
  },
  {
    code: 'CL',
    name: 'Chile'
  },
  {
    code: 'KY',
    name: 'Cayman Islands'
  },
  {
    code: 'TJ',
    name: 'Tajikistan'
  },
  {
    code: 'CM',
    name: 'Cameroon'
  },
  {
    code: 'KZ',
    name: 'Kazakstan'
  },
  {
    code: 'CN',
    name: 'China'
  },
  {
    code: 'WF',
    name: 'Wallis and Futuna'
  },
  {
    code: 'FI',
    name: 'Finland'
  },
  {
    code: 'ZA',
    name: 'South Africa'
  },
  {
    code: 'ID',
    name: 'Indonesia'
  },
  {
    code: 'CO',
    name: 'Colombia'
  },
  {
    code: 'FJ',
    name: 'Fiji'
  },
  {
    code: 'IE',
    name: 'Ireland'
  },
  {
    code: 'TK',
    name: 'Tokelau'
  },
  {
    code: 'TM',
    name: 'Turkmenistan'
  },
  {
    code: 'FK',
    name: 'Falkland Islands (Malvinas)'
  },
  {
    code: 'LA',
    name: "Lao People's Democratic Republic"
  },
  {
    code: 'NU',
    name: 'Niue'
  },
  {
    code: 'TN',
    name: 'Tunisia'
  },
  {
    code: 'LB',
    name: 'Lebanon'
  },
  {
    code: 'TO',
    name: 'Tonga'
  },
  {
    code: 'CR',
    name: 'Costa Rica'
  },
  {
    code: 'FM',
    name: 'Micronesia, Federated States of'
  },
  {
    code: 'LC',
    name: 'Saint Lucia'
  },
  {
    code: 'NZ',
    name: 'New Zealand'
  },
  {
    code: 'FO',
    name: 'Faroe Islands'
  },
  {
    code: 'TR',
    name: 'Turkey'
  },
  {
    code: 'CU',
    name: 'Cuba'
  },
  {
    code: 'CV',
    name: 'Cape Verde'
  },
  {
    code: 'IL',
    name: 'Israel'
  },
  {
    code: 'TT',
    name: 'Trinidad and Tobago'
  },
  {
    code: 'FR',
    name: 'France'
  },
  {
    code: 'IN',
    name: 'India'
  },
  {
    code: 'LI',
    name: 'Liechtenstein'
  },
  {
    code: 'TV',
    name: 'Tuvalu'
  },
  {
    code: 'IO',
    name: 'British Indian Ocean Territory'
  },
  {
    code: 'CY',
    name: 'Cyprus'
  },
  {
    code: 'TW',
    name: 'Taiwan'
  },
  {
    code: 'LK',
    name: 'Sri Lanka'
  },
  {
    code: 'AD',
    name: 'Andorra'
  },
  {
    code: 'ZM',
    name: 'Zambia'
  },
  {
    code: 'CZ',
    name: 'Czech Republic'
  },
  {
    code: 'WS',
    name: 'Samoa'
  },
  {
    code: 'IQ',
    name: 'Iraq'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates'
  },
  {
    code: 'IR',
    name: 'Iran, Islamic Republic of'
  },
  {
    code: 'AF',
    name: 'Afghanistan'
  },
  {
    code: 'TZ',
    name: 'Tanzania, United Republic of'
  },
  {
    code: 'IS',
    name: 'Iceland'
  },
  {
    code: 'AG',
    name: 'Antigua and Barbuda'
  },
  {
    code: 'RE',
    name: 'Reunion'
  },
  {
    code: 'IT',
    name: 'Italy'
  },
  {
    code: 'UA',
    name: 'Ukraine'
  },
  {
    code: 'AI',
    name: 'Anguilla'
  },
  {
    code: 'DE',
    name: 'Germany'
  },
  {
    code: 'LR',
    name: 'Liberia'
  },
  {
    code: 'GA',
    name: 'Gabon'
  },
  {
    code: 'OM',
    name: 'Oman'
  },
  {
    code: 'LS',
    name: 'Lesotho'
  },
  {
    code: 'GB',
    name: 'United Kingdom'
  },
  {
    code: 'AL',
    name: 'Albania'
  },
  {
    code: 'LT',
    name: 'Lithuania'
  },
  {
    code: 'AM',
    name: 'Armenia'
  },
  {
    code: 'ZW',
    name: 'Zimbabwe'
  },
  {
    code: 'LU',
    name: 'Luxembourg'
  },
  {
    code: 'GD',
    name: 'Grenada'
  },
  {
    code: 'AN',
    name: 'Netherlands Antilles'
  },
  {
    code: 'LV',
    name: 'Latvia'
  },
  {
    code: 'DJ',
    name: 'Djibouti'
  },
  {
    code: 'GE',
    name: 'Georgia'
  },
  {
    code: 'AO',
    name: 'Angola'
  },
  {
    code: 'UG',
    name: 'Uganda'
  },
  {
    code: 'DK',
    name: 'Denmark'
  },
  {
    code: 'GF',
    name: 'French Guiana'
  },
  {
    code: 'AP',
    name: 'Asia/Pacific Region'
  },
  {
    code: 'AQ',
    name: 'Antarctica'
  },
  {
    code: 'LY',
    name: 'Libyan Arab Jamahiriya'
  },
  {
    code: 'DM',
    name: 'Dominica'
  },
  {
    code: 'AR',
    name: 'Argentina'
  },
  {
    code: 'RO',
    name: 'Romania'
  },
  {
    code: 'GH',
    name: 'Ghana'
  },
  {
    code: 'AS',
    name: 'American Samoa'
  },
  {
    code: 'GI',
    name: 'Gibraltar'
  },
  {
    code: 'DO',
    name: 'Dominican Republic'
  },
  {
    code: 'AT',
    name: 'Austria'
  },
  {
    code: 'UM',
    name: 'United States Minor Outlying Islands'
  },
  {
    code: 'AU',
    name: 'Australia'
  },
  {
    code: 'MA',
    name: 'Morocco'
  },
  {
    code: 'RS',
    name: 'Serbia'
  },
  {
    code: 'GL',
    name: 'Greenland'
  },
  {
    code: 'GM',
    name: 'Gambia'
  },
  {
    code: 'MC',
    name: 'Monaco'
  },
  {
    code: 'AW',
    name: 'Aruba'
  },
  {
    code: 'RU',
    name: 'Russia'
  },
  {
    code: 'GN',
    name: 'Guinea'
  },
  {
    code: 'MD',
    name: 'Moldova, Republic of'
  },
  {
    code: 'ME',
    name: 'Montenegro'
  },
  {
    code: 'RW',
    name: 'Rwanda'
  },
  {
    code: 'AZ',
    name: 'Azerbaijan'
  },
  {
    code: 'PA',
    name: 'Panama'
  },
  {
    code: 'GP',
    name: 'Guadeloupe'
  },
  {
    code: 'US',
    name: 'United States'
  },
  {
    code: 'GQ',
    name: 'Equatorial Guinea'
  },
  {
    code: 'MG',
    name: 'Madagascar'
  },
  {
    code: 'MH',
    name: 'Marshall Islands'
  },
  {
    code: 'GR',
    name: 'Greece'
  },
  {
    code: 'BA',
    name: 'Bosnia and Herzegovina'
  },
  {
    code: 'JM',
    name: 'Jamaica'
  },
  {
    code: 'BB',
    name: 'Barbados'
  },
  {
    code: 'PE',
    name: 'Peru'
  },
  {
    code: 'GT',
    name: 'Guatemala'
  },
  {
    code: 'JO',
    name: 'Jordan'
  },
  {
    code: 'MK',
    name: 'Macedonia'
  },
  {
    code: 'DZ',
    name: 'Algeria'
  },
  {
    code: 'GU',
    name: 'Guam'
  },
  {
    code: 'SA',
    name: 'Saudi Arabia'
  },
  {
    code: 'JP',
    name: 'Japan'
  },
  {
    code: 'ML',
    name: 'Mali'
  },
  {
    code: 'BE',
    name: 'Belgium'
  },
  {
    code: 'BD',
    name: 'Bangladesh'
  },
  {
    code: 'PG',
    name: 'Papua New Guinea'
  },
  {
    code: 'UY',
    name: 'Uruguay'
  },
  {
    code: 'MM',
    name: 'Myanmar'
  },
  {
    code: 'PH',
    name: 'Philippines'
  },
  {
    code: 'SC',
    name: 'Seychelles'
  },
  {
    code: 'GW',
    name: 'Guinea-Bissau'
  },
  {
    code: 'UZ',
    name: 'Uzbekistan'
  },
  {
    code: 'SD',
    name: 'Sudan'
  },
  {
    code: 'BG',
    name: 'Bulgaria'
  },
  {
    code: 'PF',
    name: 'French Polynesia'
  },
  {
    code: 'SB',
    name: 'Solomon Islands'
  },
  {
    code: 'MN',
    name: 'Mongolia'
  },
  {
    code: 'MO',
    name: 'Macau'
  },
  {
    code: 'EC',
    name: 'Ecuador'
  },
  {
    code: 'GY',
    name: 'Guyana'
  },
  {
    code: 'SE',
    name: 'Sweden'
  },
  {
    code: 'BH',
    name: 'Bahrain'
  },
  {
    code: 'VA',
    name: 'Holy See (Vatican City State)'
  },
  {
    code: 'MP',
    name: 'Northern Mariana Islands'
  },
  {
    code: 'PK',
    name: 'Pakistan'
  },
  {
    code: 'BI',
    name: 'Burundi'
  },
  {
    code: 'BF',
    name: 'Burkina Faso'
  },
  {
    code: 'MQ',
    name: 'Martinique'
  },
  {
    code: 'EE',
    name: 'Estonia'
  },
  {
    code: 'PL',
    name: 'Poland'
  },
  {
    code: 'SG',
    name: 'Singapore'
  },
  {
    code: 'BJ',
    name: 'Benin'
  },
  {
    code: 'VC',
    name: 'Saint Vincent and the Grenadines'
  },
  {
    code: 'MR',
    name: 'Mauritania'
  },
  {
    code: 'MS',
    name: 'Montserrat'
  },
  {
    code: 'SI',
    name: 'Slovenia'
  },
  {
    code: 'EG',
    name: 'Egypt'
  },
  {
    code: 'VE',
    name: 'Venezuela'
  },
  {
    code: 'MT',
    name: 'Malta'
  },
  {
    code: 'BM',
    name: 'Bermuda'
  },
  {
    code: 'MU',
    name: 'Mauritius'
  },
  {
    code: 'SK',
    name: 'Slovakia'
  },
  {
    code: 'BN',
    name: 'Brunei Darussalam'
  },
  {
    code: 'VG',
    name: 'Virgin Islands, British'
  },
  {
    code: 'SL',
    name: 'Sierra Leone'
  },
  {
    code: 'BO',
    name: 'Bolivia'
  },
  {
    code: 'MV',
    name: 'Maldives'
  },
  {
    code: 'MW',
    name: 'Malawi'
  },
  {
    code: 'PR',
    name: 'Puerto Rico'
  }
];

// alphabetize
module.exports = _.sortBy(countryList, function(o) {return o.name;});
