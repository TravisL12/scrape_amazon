const { onlyUnique } = require("./utils");

const wholeFoodIds = [
  "111-0056324-0237076",
  "111-1019742-7655425",
  "111-1309737-0653840",
  "111-1508933-7454613",
  "111-3217147-8387443",
  "111-4687994-8257866",
  "111-4996918-5418650",
  "112-0395262-9464231",
  "112-0641508-4509027",
  "112-0685523-2981828",
  "112-0836860-5290647",
  "112-1149767-3182645",
  "112-1188022-6046635",
  "112-1363061-5245041",
  "112-1517443-3170641",
  "112-1624295-8099455",
  "112-1725680-1113803",
  "112-2202739-3284228",
  "112-2285846-0481824",
  "112-2343841-7457051",
  "112-2526558-8261851",
  "112-2577351-5961862",
  "112-2601948-2933800",
  "112-2669522-7949835",
  "112-2678928-9837021",
  "112-2820122-2363408",
  "112-3044464-3958607",
  "112-3219179-7996217",
  "112-3669615-0091429",
  "112-3827548-2305057",
  "112-3932133-3442618",
  "112-4249856-0110616",
  "112-4511697-4581019",
  "112-4647590-8613004",
  "112-4742226-1184210",
  "112-4888725-9139413",
  "112-5153577-7278607",
  "112-5531547-1343403",
  "112-5976835-3401003",
  "112-6235860-7051427",
  "112-6559432-2421834",
  "112-6597822-9652245",
  "112-6961351-6314625",
  "112-7274590-9730636",
  "112-7309690-8424262",
  "112-7550538-6640200",
  "112-7965815-9609037",
  "112-8194127-0588250",
  "112-8537583-5089843",
  "112-8802721-3014611",
  "112-9143351-6261010",
  "112-9287411-6365808",
  "112-9616863-5318621",
  "112-9638641-2020221",
  "112-9832690-4207404",
  "112-9870744-7937800",
  "113-0149613-2789020",
  "113-0742834-0244211",
  "113-1110828-1792241",
  "113-1137707-7458622",
  "113-1546356-5649036",
  "113-3366375-0657833",
  "113-3768036-0494634",
  "113-4110427-1660221",
  "113-4140640-5909808",
  "113-5375343-7582646",
  "113-5873510-5949836",
  "113-5933126-3431467",
  "113-7058045-0009014",
  "113-7917435-2833854",
  "113-8750533-3598658",
  "113-9234472-8455423",
  "113-9773087-0333047",
  "113-9913337-9256265",
  "114-0050089-4626639",
  "114-0756866-7258660",
  "114-0765799-8416223",
  "114-1059759-9545017",
  "114-1849716-0416205",
  "114-2363746-1455430",
  "114-2414577-6179405",
  "114-2655692-0133049",
  "114-3042673-8653031",
  "114-3155579-0448226",
  "114-3243675-3785868",
  "114-3540162-9489804",
  "114-3906351-0582601",
  "114-5218682-1909018",
  "114-6072856-3526640",
  "114-6345745-6937862",
  "114-6744303-1536264",
  "114-6936239-0432261",
  "114-7490894-9272222",
  "114-7671851-9839461",
  "114-8336546-9185862",
  "114-8866560-4829056",
  "114-9205878-6338605",
  "114-9596757-8259459",
  "114-9723838-4301840",
  "114-9863000-3635423",
];

const freshIds = [
  "111-0056324-0237076",
  "111-1019742-7655425",
  "111-1309737-0653840",
  "111-1508933-7454613",
  "111-1618372-5705823",
  "111-1687189-8288235",
  "111-3176163-7553025",
  "111-3217147-8387443",
  "111-4687994-8257866",
  "111-4996918-5418650",
  "112-0003904-1610638",
  "112-0338393-6105824",
  "112-0395262-9464231",
  "112-0641508-4509027",
  "112-0685523-2981828",
  "112-0836860-5290647",
  "112-1149767-3182645",
  "112-1188022-6046635",
  "112-1363061-5245041",
  "112-1517443-3170641",
  "112-1624295-8099455",
  "112-1709875-9401826",
  "112-1725680-1113803",
  "112-2029619-4816243",
  "112-2070201-7205830",
  "112-2098553-6249032",
  "112-2202739-3284228",
  "112-2285846-0481824",
  "112-2343841-7457051",
  "112-2526558-8261851",
  "112-2577351-5961862",
  "112-2601948-2933800",
  "112-2669522-7949835",
  "112-2678928-9837021",
  "112-2733832-8844256",
  "112-2820122-2363408",
  "112-2820190-4581004",
  "112-3044464-3958607",
  "112-3219179-7996217",
  "112-3545453-2491416",
  "112-3669615-0091429",
  "112-3827548-2305057",
  "112-3932133-3442618",
  "112-4249856-0110616",
  "112-4257114-5443405",
  "112-4374739-0637800",
  "112-4511697-4581019",
  "112-4647590-8613004",
  "112-4742226-1184210",
  "112-4888725-9139413",
  "112-5013404-0380265",
  "112-5153577-7278607",
  "112-5531547-1343403",
  "112-5677490-8428223",
  "112-5917569-8585864",
  "112-5976835-3401003",
  "112-6235860-7051427",
  "112-6597822-9652245",
  "112-6961351-6314625",
  "112-7274590-9730636",
  "112-7550538-6640200",
  "112-7650463-5045868",
  "112-7965815-9609037",
  "112-8194127-0588250",
  "112-8221412-0112238",
  "112-8243329-4717816",
  "112-8537583-5089843",
  "112-8675834-8977846",
  "112-8802721-3014611",
  "112-9143351-6261010",
  "112-9287411-6365808",
  "112-9616863-5318621",
  "112-9638641-2020221",
  "112-9832690-4207404",
  "112-9870744-7937800",
  "113-0149613-2789020",
  "113-0612000-4653053",
  "113-0742834-0244211",
  "113-1110828-1792241",
  "113-1137707-7458622",
  "113-1546356-5649036",
  "113-3366375-0657833",
  "113-3768036-0494634",
  "113-4110427-1660221",
  "113-4140640-5909808",
  "113-4987643-1416266",
  "113-5234070-7633032",
  "113-5268096-8379465",
  "113-5328846-8310662",
  "113-5375343-7582646",
  "113-5873510-5949836",
  "113-5933126-3431467",
  "113-7058045-0009014",
  "113-7429433-2100221",
  "113-7917435-2833854",
  "113-8750533-3598658",
  "113-8791001-4766644",
  "113-9234472-8455423",
  "113-9913337-9256265",
  "114-0050089-4626639",
  "114-0756866-7258660",
  "114-0765799-8416223",
  "114-1059759-9545017",
  "114-1739221-2689055",
  "114-1849716-0416205",
  "114-2363746-1455430",
  "114-2414577-6179405",
  "114-2655692-0133049",
  "114-2661209-7441032",
  "114-3042673-8653031",
  "114-3155579-0448226",
  "114-3243675-3785868",
  "114-3540162-9489804",
  "114-3542376-2905054",
  "114-3906351-0582601",
  "114-3964199-9185015",
  "114-4071259-2599401",
  "114-4224735-7357028",
  "114-5218682-1909018",
  "114-5545953-2029014",
  "114-6072856-3526640",
  "114-6153429-1030602",
  "114-6345745-6937862",
  "114-6744303-1536264",
  "114-6936239-0432261",
  "114-7449479-6918653",
  "114-7490894-9272222",
  "114-7671851-9839461",
  "114-7728358-1391454",
  "114-7848169-9609067",
  "114-8336546-9185862",
  "114-8438108-2435461",
  "114-8866560-4829056",
  "114-9135540-6780237",
  "114-9205878-6338605",
  "114-9539038-0274610",
  "114-9596757-8259459",
  "114-9723838-4301840",
  "114-9863000-3635423",
];

const uniqIds = [...wholeFoodIds, ...freshIds].filter(onlyUnique);

// function filterCompareUniq(a, b) {
//   return a.filter((itemA) => !b.includes(itemA));
// }
// console.log(filterCompareUniq(wholeFoodIds, previous));

module.exports = { ids: uniqIds };
