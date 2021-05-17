import { MapItemVisualization } from "@/models/MapItemVisualization";
import BaseModelDataService from "@/services/BaseModelDataService";

class PictogramService {

    private _pictograms = new Map<string, string>();

    /* 
        ***************************************************************
        IMPORTANT 
    
        currently the value for the fillcolor has to be '%23FEFEFE'. otherwise the color will not changed through it states
    
        ***************************************************************
    */

    //https://www.gitmemory.com/issue/openlayers/openlayers/9597/495554753

    public async InitService(): Promise<void> {
        const allPicts = await BaseModelDataService.getPictrograms();

        allPicts.forEach(element => {
            this._pictograms.set(element.Id, element.Svg.replaceAll('#', '%23'));
        });

        //Add the missing pictograms
        this._pictograms.set('DEFAULT', '<svg width="18" height="18.0" version="1.1" xmlns="http://www.w3.org/2000/svg">'
            + '<rect fill="%23ffffff" width="18" height="18" />'
            + '</svg>');

        this._pictograms.set('OFFPIER_STAND_RECT', '<svg width="22.5" height="13.9" version="1.1" xmlns="http://www.w3.org/2000/svg">'
            + '<rect fill="%23FEFEFE" width="22.5" height="13.9" />'
            + '</svg>');

        this._pictograms.set('AIRCRAFT', '<svg width="150" height="150" version="1.1" xmlns="http://www.w3.org/2000/svg">'
            + '<path transform="translate(47 68)  scale (3.5)" stroke="black" stroke-width="0.2" fill="%23FEFEFE"  d="m 7.6513963,5.7165852 c 0.002,-0.878417 0.005,-1.756833 0.0163,-2.419615 0.0116,-0.662516 0.0326,-1.109662 0.0918,-1.500452 0.0593,-0.390789 0.15687,-0.725487 0.2413,-0.98213304 0.0845,-0.25691001 0.1557,-0.43576901 0.21457,-0.55324401 0.0589,-0.11721 0.10536,-0.173037 0.15727,-0.207962 0.0519,-0.03493 0.10922,-0.04868 0.16732,-0.04789 0.0581,7.94e-4 0.11698,0.01614 0.16267,0.0463 0.0457,0.03016 0.0782,0.07514 0.12935,0.175154 0.0512,0.100013 0.12087,0.254794 0.18516,0.43233 0.0643,0.17727001 0.12316,0.37729505 0.17817,0.59478305 0.055,0.217752 0.10612,0.453231 0.14097,0.660929 0.0349,0.207433 0.0535,0.38735 0.0651,0.553773 0.0116,0.166423 0.0163,0.319881 0.0209,0.47334 l -0.0126,2.795322 0.4288899,0.34925 1.6407598,1.48934 0.005,-0.278342 -0.10226,0.0048 c -0.017,-0.05265 -0.0341,-0.105304 -0.0473,-0.209286 -0.0132,-0.103716 -0.0225,-0.258497 -0.0163,-0.395816 0.006,-0.137054 0.0279,-0.256381 0.048,-0.330729 0.0202,-0.07435 0.0387,-0.103717 0.0728,-0.118534 0.0341,-0.01455 0.0837,-0.01455 0.17275,-0.01376 0.0891,7.94e-4 0.21767,0.0021 0.2936,0.01164 0.0759,0.0093 0.0991,0.02619 0.11774,0.07117 0.0186,0.04498 0.0325,0.117739 0.0426,0.21537 0.0101,0.09763 0.0163,0.219869 0.0101,0.350838 -0.006,0.130969 -0.0248,0.270404 -0.0434,0.409839 l -0.10223,0.0045 c 0.003,0.10848 0.006,0.216959 -0.002,0.35269 -0.006,0.09922 -0.0172,0.21299 -0.0275,0.308504 l 1.94257,1.7634477 c -0.0133,-0.04339 -0.026,-0.0934 -0.0364,-0.1748897 -0.0132,-0.103981 -0.0225,-0.258762 -0.0163,-0.395816 0.006,-0.137319 0.0279,-0.256646 0.048,-0.330994 0.0201,-0.07435 0.0387,-0.103717 0.0728,-0.118533 0.0341,-0.01455 0.0837,-0.01455 0.17275,-0.01376 0.0891,7.94e-4 0.21767,0.0024 0.29358,0.01164 0.0759,0.0093 0.0992,0.02619 0.11777,0.07117 0.0186,0.04498 0.0325,0.11774 0.0426,0.215371 0.01,0.09763 0.0163,0.219869 0.01,0.350837 -0.006,0.130969 -0.0248,0.270404 -0.0434,0.4098397 l -0.10227,0.0048 c 0.003,0.108215 0.006,0.216694 -0.002,0.3524251 l -0.008,0.116417 2.14514,1.947333 c 0.11311,0.09922 0.22619,0.198173 0.30133,0.271727 0.0751,0.07382 0.11235,0.121709 0.13248,0.174361 0.0201,0.05265 0.0232,0.110067 0.0209,0.259556 -0.002,0.14949 -0.0101,0.391319 -0.0225,0.511175 -0.0124,0.120121 -0.0294,0.118533 -0.13245,0.05741 -0.10307,-0.06118 -0.29209,-0.182091 -1.10351,-0.684005 -0.5859,-0.362479 -1.49627,-0.923661 -2.23049,-1.374775 l -0.006,0.06985 c -0.0122,0.130175 -0.0285,0.198702 -0.0378,0.233098 -0.009,0.03413 -0.0116,0.03413 -0.025,-0.01879 -0.0134,-0.05265 -0.0378,-0.158485 -0.0523,-0.303212 l -0.005,-0.05821 -0.61524,-0.377031 -0.27048,-0.164571 -0.006,0.07699 c -0.0122,0.130175 -0.0285,0.198702 -0.0378,0.233098 -0.009,0.0344 -0.0116,0.0344 -0.025,-0.01852 -0.0134,-0.05292 -0.0378,-0.15875 -0.0523,-0.303212 l -0.006,-0.06403 c -0.3614,-0.21299 -0.45805,-0.24183 -0.83677,-0.357453 l -0.60593,-0.185737 -0.009,0.124354 c -0.0122,0.130175 -0.0285,0.198702 -0.0378,0.232833 -0.009,0.0344 -0.0116,0.0344 -0.025,-0.01852 -0.0134,-0.05292 -0.0378,-0.158486 -0.0523,-0.303213 l -0.006,-0.07541 -0.6338,-0.1942041 -0.007,0.09128 c -0.0122,0.12991 -0.0285,0.198702 -0.0378,0.232833 -0.009,0.0344 -0.0116,0.0344 -0.025,-0.01852 -0.0134,-0.05292 -0.0378,-0.15875 -0.0523,-0.3032123 l -0.004,-0.04075 -0.4535998,-0.139171 -0.1617399,-0.05001 c 0.001,1.1183943 0.002,2.2142983 -4e-4,2.9225883 -0.003,0.750887 -0.009,1.065477 -0.0288,1.344612 -0.0201,0.279135 -0.0542,0.523081 -0.0968,0.844815 -0.0322,0.243152 -0.0692,0.530754 -0.11703,0.855398 -2.4e-4,0.09366 5.3e-4,0.170127 0.004,0.23151 0.005,0.103187 0.0178,0.163512 0.055,0.230187 0.0372,0.06641 0.0992,0.139436 0.20529,0.243153 0.1061299,0.103716 0.2564099,0.238654 0.5703397,0.5334 0.31393,0.294745 0.79147,0.7493 1.0541,1.000654 0.2626,0.251089 0.31022,0.298714 0.34393,0.343958 0.0337,0.04551 0.0534,0.08837 0.0674,0.132556 0.0139,0.04419 0.0221,0.08943 0.0256,0.202142 0.003,0.112713 0.002,0.292894 0.001,0.473075 l -2.7995497,-0.82151 -0.18238,0.862012 c -0.0609,-0.291571 -0.1217,-0.582877 -0.18063,-0.877358 l -2.75698,0.808831 c -0.001,-0.180181 -0.002,-0.360098 10e-4,-0.47281 0.003,-0.112713 0.0116,-0.157956 0.0256,-0.202142 0.0139,-0.04419 0.0337,-0.08731 0.0674,-0.132556 0.0337,-0.04524 0.0814,-0.09287 0.34396,-0.344223 0.26259,-0.25109 0.74017,-0.705908 1.05407,-1.000654 0.31393,-0.294746 0.46421,-0.429419 0.57033,-0.533136 0.10613,-0.103981 0.16809,-0.176741 0.20529,-0.243416 0.0372,-0.06668 0.0496,-0.127 0.055,-0.229923 l 0.004,-0.147373 c -0.0572,-0.375708 -0.11153,-0.749565 -0.15022,-1.042194 -0.062,-0.468312 -0.0837,-0.727869 -0.0941,-0.881327 -0.0105,-0.153194 -0.01,-0.200554 -0.006,-0.804333 l 0.012,-2.407709 c 0.002,-0.6069546 9.5e-4,-0.7564436 -1.9e-4,-0.8974663 l -0.19269,0.05927 -0.44916,0.137848 -0.005,0.05609 c -0.0145,0.1447273 -0.0389,0.2505603 -0.0523,0.3034773 -0.0134,0.05265 -0.0157,0.05265 -0.025,0.01852 -0.009,-0.0344 -0.0256,-0.102923 -0.0378,-0.233098 l -0.008,-0.1058333 -0.63193,0.1934103 -0.007,0.09075 c -0.0145,0.144727 -0.0389,0.250561 -0.0523,0.303477 -0.0134,0.05265 -0.0157,0.05265 -0.025,0.01852 -0.009,-0.0344 -0.0256,-0.102923 -0.0378,-0.233098 -0.004,-0.04154 -0.007,-0.08943 -0.01,-0.139171 l -0.60841,0.186532 c -0.37722,0.115093 -0.47461,0.144197 -0.83241,0.35507 l -0.007,0.08043 c -0.0145,0.144727 -0.0389,0.25056 -0.0523,0.303212 -0.0134,0.05292 -0.0157,0.05292 -0.025,0.01879 -0.009,-0.0344 -0.0256,-0.102923 -0.0378,-0.233098 l -0.007,-0.0926 -0.27273,0.165893 -0.61079,0.374386 -0.006,0.07514 c -0.0145,0.144727 -0.0389,0.250296 -0.0523,0.303213 -0.0134,0.05292 -0.0157,0.05292 -0.025,0.01852 -0.009,-0.03413 -0.0256,-0.102659 -0.0378,-0.232834 l -0.007,-0.08546 c -0.7346,0.451379 -1.64621,1.013354 -2.23268,1.376098 -0.81142998,0.501914 -1.00043994,0.622829 -1.10346994,0.683948 -0.10303,0.06112 -0.12007,0.06271 -0.13246,-0.05741 -0.0124,-0.119856 -0.0202,-0.361685 -0.0225,-0.511175 -0.002,-0.149489 7.8e-4,-0.206904 0.0209,-0.259556 0.0201,-0.05265 0.0573,-0.100542 0.13246,-0.174361 0.0751,-0.07355 0.18824,-0.172508 0.30132996,-0.271727 l 2.14039998,-1.9431 -0.009,-0.12065 c -0.008,-0.1357313 -0.005,-0.2439453 -0.002,-0.3524253 l -0.10225,-0.0048 c -0.0186,-0.1394357 -0.0372,-0.2788707 -0.0434,-0.4098397 -0.006,-0.130968 0,-0.253206 0.0101,-0.350837 0.0101,-0.09763 0.024,-0.170392 0.0426,-0.215371 0.0186,-0.04498 0.0418,-0.06191 0.11775,-0.07117 0.0759,-0.0093 0.20449,-0.01085 0.29358,-0.01164 0.0891,-7.93e-4 0.13867,-7.93e-4 0.17274,0.01402 0.0341,0.01455 0.0527,0.04392 0.0728,0.118269 0.0202,0.07461 0.0418,0.193675 0.0481,0.330994 0.006,0.137054 -0.003,0.291835 -0.0163,0.395816 -0.0109,0.08572 -0.0244,0.136525 -0.0384,0.1812397 l 1.95749,-1.7769417 c -0.0101,-0.09393 -0.0212,-0.204523 -0.0267,-0.30136 -0.008,-0.135731 -0.005,-0.24421 -0.002,-0.35269 l -0.10227,-0.0045 c -0.0186,-0.139435 -0.0372,-0.27887 -0.0434,-0.409839 -0.006,-0.130969 0,-0.253206 0.0101,-0.350838 0.0101,-0.09763 0.024,-0.170391 0.0426,-0.21537 0.0186,-0.04498 0.0418,-0.06191 0.11774,-0.07117 0.0759,-0.0095 0.20452,-0.01085 0.29361,-0.01164 0.0891,-7.94e-4 0.13864,-7.94e-4 0.17275,0.01376 0.0341,0.01482 0.0527,0.04419 0.0728,0.118534 0.0201,0.07435 0.0418,0.193675 0.048,0.330729 0.006,0.137319 -0.003,0.2921 -0.0163,0.395816 -0.0132,0.103982 -0.0302,0.156634 -0.0473,0.209286 l -0.10223,-0.0048 0.004,0.270669 1.63232,-1.481667 0.43302,-0.352689 z m -4.55713,4.0351597 10e-4,0.07647 0.0802,-0.07276 z m 10.8624897,0 -0.0767,0.0034 0.0755,0.06853 z" /> '
            + '</svg>');

        this._pictograms.set('BAGGAGE_BELT', '<svg width="43.0" height="15.0" version="1.1" xmlns="http://www.w3.org/2000/svg">'
            + '<path fill="%23FEFEFE" stroke-width="1" stroke="black" d="M 5.5,0.5L 35.5004,0.5C 38.262,0.5 40.5005,2.73859 40.5005,5.5L 40.5005,8.49927C 40.5005,11.2607 38.262,13.4993 35.5004,13.4993L 5.5,13.4993C 2.73865,13.4993 0.5,11.2607 0.5,8.49927L 0.5,5.5C 0.5,2.73859 2.73865,0.5 5.5,0.5 Z " /> '
            + '</svg>');

        this._pictograms.set('CI_COUNTER', '<svg width="9.0" height="9.0" version="1.1" xmlns="http://www.w3.org/2000/svg">'
            + '<rect stroke="black" stroke-width="0.2"  fill="%23FEFEFE" width="9.0" height="9.0" />'
            + '</svg>');

        this._pictograms.set('GATES', '<svg width="13.25" height="13.25" version="1.1" xmlns="http://www.w3.org/2000/svg">'
            + '<path  stroke="%23ffffff" stroke-width="0.2"  fill="%23FEFEFE"  d="M 0.124756,0.124939L 13.1248,0.124939L 13.1248,13.125L 0.124756,13.1249L 0.124756,0.124939 Z" /> '
            + '</svg>');

        this._pictograms.set('NARROW_BODY', '<svg width="150" height="150" version="1.1" xmlns="http://www.w3.org/2000/svg">'
            + '<path transform="translate(42 45)  scale (3.5)" fill="%23bbc4d3"  d="m 7.6513963,5.7165852 c 0.002,-0.878417 0.005,-1.756833 0.0163,-2.419615 0.0116,-0.662516 0.0326,-1.109662 0.0918,-1.500452 0.0593,-0.390789 0.15687,-0.725487 0.2413,-0.98213304 0.0845,-0.25691001 0.1557,-0.43576901 0.21457,-0.55324401 0.0589,-0.11721 0.10536,-0.173037 0.15727,-0.207962 0.0519,-0.03493 0.10922,-0.04868 0.16732,-0.04789 0.0581,7.94e-4 0.11698,0.01614 0.16267,0.0463 0.0457,0.03016 0.0782,0.07514 0.12935,0.175154 0.0512,0.100013 0.12087,0.254794 0.18516,0.43233 0.0643,0.17727001 0.12316,0.37729505 0.17817,0.59478305 0.055,0.217752 0.10612,0.453231 0.14097,0.660929 0.0349,0.207433 0.0535,0.38735 0.0651,0.553773 0.0116,0.166423 0.0163,0.319881 0.0209,0.47334 l -0.0126,2.795322 0.4288899,0.34925 1.6407598,1.48934 0.005,-0.278342 -0.10226,0.0048 c -0.017,-0.05265 -0.0341,-0.105304 -0.0473,-0.209286 -0.0132,-0.103716 -0.0225,-0.258497 -0.0163,-0.395816 0.006,-0.137054 0.0279,-0.256381 0.048,-0.330729 0.0202,-0.07435 0.0387,-0.103717 0.0728,-0.118534 0.0341,-0.01455 0.0837,-0.01455 0.17275,-0.01376 0.0891,7.94e-4 0.21767,0.0021 0.2936,0.01164 0.0759,0.0093 0.0991,0.02619 0.11774,0.07117 0.0186,0.04498 0.0325,0.117739 0.0426,0.21537 0.0101,0.09763 0.0163,0.219869 0.0101,0.350838 -0.006,0.130969 -0.0248,0.270404 -0.0434,0.409839 l -0.10223,0.0045 c 0.003,0.10848 0.006,0.216959 -0.002,0.35269 -0.006,0.09922 -0.0172,0.21299 -0.0275,0.308504 l 1.94257,1.7634477 c -0.0133,-0.04339 -0.026,-0.0934 -0.0364,-0.1748897 -0.0132,-0.103981 -0.0225,-0.258762 -0.0163,-0.395816 0.006,-0.137319 0.0279,-0.256646 0.048,-0.330994 0.0201,-0.07435 0.0387,-0.103717 0.0728,-0.118533 0.0341,-0.01455 0.0837,-0.01455 0.17275,-0.01376 0.0891,7.94e-4 0.21767,0.0024 0.29358,0.01164 0.0759,0.0093 0.0992,0.02619 0.11777,0.07117 0.0186,0.04498 0.0325,0.11774 0.0426,0.215371 0.01,0.09763 0.0163,0.219869 0.01,0.350837 -0.006,0.130969 -0.0248,0.270404 -0.0434,0.4098397 l -0.10227,0.0048 c 0.003,0.108215 0.006,0.216694 -0.002,0.3524251 l -0.008,0.116417 2.14514,1.947333 c 0.11311,0.09922 0.22619,0.198173 0.30133,0.271727 0.0751,0.07382 0.11235,0.121709 0.13248,0.174361 0.0201,0.05265 0.0232,0.110067 0.0209,0.259556 -0.002,0.14949 -0.0101,0.391319 -0.0225,0.511175 -0.0124,0.120121 -0.0294,0.118533 -0.13245,0.05741 -0.10307,-0.06118 -0.29209,-0.182091 -1.10351,-0.684005 -0.5859,-0.362479 -1.49627,-0.923661 -2.23049,-1.374775 l -0.006,0.06985 c -0.0122,0.130175 -0.0285,0.198702 -0.0378,0.233098 -0.009,0.03413 -0.0116,0.03413 -0.025,-0.01879 -0.0134,-0.05265 -0.0378,-0.158485 -0.0523,-0.303212 l -0.005,-0.05821 -0.61524,-0.377031 -0.27048,-0.164571 -0.006,0.07699 c -0.0122,0.130175 -0.0285,0.198702 -0.0378,0.233098 -0.009,0.0344 -0.0116,0.0344 -0.025,-0.01852 -0.0134,-0.05292 -0.0378,-0.15875 -0.0523,-0.303212 l -0.006,-0.06403 c -0.3614,-0.21299 -0.45805,-0.24183 -0.83677,-0.357453 l -0.60593,-0.185737 -0.009,0.124354 c -0.0122,0.130175 -0.0285,0.198702 -0.0378,0.232833 -0.009,0.0344 -0.0116,0.0344 -0.025,-0.01852 -0.0134,-0.05292 -0.0378,-0.158486 -0.0523,-0.303213 l -0.006,-0.07541 -0.6338,-0.1942041 -0.007,0.09128 c -0.0122,0.12991 -0.0285,0.198702 -0.0378,0.232833 -0.009,0.0344 -0.0116,0.0344 -0.025,-0.01852 -0.0134,-0.05292 -0.0378,-0.15875 -0.0523,-0.3032123 l -0.004,-0.04075 -0.4535998,-0.139171 -0.1617399,-0.05001 c 0.001,1.1183943 0.002,2.2142983 -4e-4,2.9225883 -0.003,0.750887 -0.009,1.065477 -0.0288,1.344612 -0.0201,0.279135 -0.0542,0.523081 -0.0968,0.844815 -0.0322,0.243152 -0.0692,0.530754 -0.11703,0.855398 -2.4e-4,0.09366 5.3e-4,0.170127 0.004,0.23151 0.005,0.103187 0.0178,0.163512 0.055,0.230187 0.0372,0.06641 0.0992,0.139436 0.20529,0.243153 0.1061299,0.103716 0.2564099,0.238654 0.5703397,0.5334 0.31393,0.294745 0.79147,0.7493 1.0541,1.000654 0.2626,0.251089 0.31022,0.298714 0.34393,0.343958 0.0337,0.04551 0.0534,0.08837 0.0674,0.132556 0.0139,0.04419 0.0221,0.08943 0.0256,0.202142 0.003,0.112713 0.002,0.292894 0.001,0.473075 l -2.7995497,-0.82151 -0.18238,0.862012 c -0.0609,-0.291571 -0.1217,-0.582877 -0.18063,-0.877358 l -2.75698,0.808831 c -0.001,-0.180181 -0.002,-0.360098 10e-4,-0.47281 0.003,-0.112713 0.0116,-0.157956 0.0256,-0.202142 0.0139,-0.04419 0.0337,-0.08731 0.0674,-0.132556 0.0337,-0.04524 0.0814,-0.09287 0.34396,-0.344223 0.26259,-0.25109 0.74017,-0.705908 1.05407,-1.000654 0.31393,-0.294746 0.46421,-0.429419 0.57033,-0.533136 0.10613,-0.103981 0.16809,-0.176741 0.20529,-0.243416 0.0372,-0.06668 0.0496,-0.127 0.055,-0.229923 l 0.004,-0.147373 c -0.0572,-0.375708 -0.11153,-0.749565 -0.15022,-1.042194 -0.062,-0.468312 -0.0837,-0.727869 -0.0941,-0.881327 -0.0105,-0.153194 -0.01,-0.200554 -0.006,-0.804333 l 0.012,-2.407709 c 0.002,-0.6069546 9.5e-4,-0.7564436 -1.9e-4,-0.8974663 l -0.19269,0.05927 -0.44916,0.137848 -0.005,0.05609 c -0.0145,0.1447273 -0.0389,0.2505603 -0.0523,0.3034773 -0.0134,0.05265 -0.0157,0.05265 -0.025,0.01852 -0.009,-0.0344 -0.0256,-0.102923 -0.0378,-0.233098 l -0.008,-0.1058333 -0.63193,0.1934103 -0.007,0.09075 c -0.0145,0.144727 -0.0389,0.250561 -0.0523,0.303477 -0.0134,0.05265 -0.0157,0.05265 -0.025,0.01852 -0.009,-0.0344 -0.0256,-0.102923 -0.0378,-0.233098 -0.004,-0.04154 -0.007,-0.08943 -0.01,-0.139171 l -0.60841,0.186532 c -0.37722,0.115093 -0.47461,0.144197 -0.83241,0.35507 l -0.007,0.08043 c -0.0145,0.144727 -0.0389,0.25056 -0.0523,0.303212 -0.0134,0.05292 -0.0157,0.05292 -0.025,0.01879 -0.009,-0.0344 -0.0256,-0.102923 -0.0378,-0.233098 l -0.007,-0.0926 -0.27273,0.165893 -0.61079,0.374386 -0.006,0.07514 c -0.0145,0.144727 -0.0389,0.250296 -0.0523,0.303213 -0.0134,0.05292 -0.0157,0.05292 -0.025,0.01852 -0.009,-0.03413 -0.0256,-0.102659 -0.0378,-0.232834 l -0.007,-0.08546 c -0.7346,0.451379 -1.64621,1.013354 -2.23268,1.376098 -0.81142998,0.501914 -1.00043994,0.622829 -1.10346994,0.683948 -0.10303,0.06112 -0.12007,0.06271 -0.13246,-0.05741 -0.0124,-0.119856 -0.0202,-0.361685 -0.0225,-0.511175 -0.002,-0.149489 7.8e-4,-0.206904 0.0209,-0.259556 0.0201,-0.05265 0.0573,-0.100542 0.13246,-0.174361 0.0751,-0.07355 0.18824,-0.172508 0.30132996,-0.271727 l 2.14039998,-1.9431 -0.009,-0.12065 c -0.008,-0.1357313 -0.005,-0.2439453 -0.002,-0.3524253 l -0.10225,-0.0048 c -0.0186,-0.1394357 -0.0372,-0.2788707 -0.0434,-0.4098397 -0.006,-0.130968 0,-0.253206 0.0101,-0.350837 0.0101,-0.09763 0.024,-0.170392 0.0426,-0.215371 0.0186,-0.04498 0.0418,-0.06191 0.11775,-0.07117 0.0759,-0.0093 0.20449,-0.01085 0.29358,-0.01164 0.0891,-7.93e-4 0.13867,-7.93e-4 0.17274,0.01402 0.0341,0.01455 0.0527,0.04392 0.0728,0.118269 0.0202,0.07461 0.0418,0.193675 0.0481,0.330994 0.006,0.137054 -0.003,0.291835 -0.0163,0.395816 -0.0109,0.08572 -0.0244,0.136525 -0.0384,0.1812397 l 1.95749,-1.7769417 c -0.0101,-0.09393 -0.0212,-0.204523 -0.0267,-0.30136 -0.008,-0.135731 -0.005,-0.24421 -0.002,-0.35269 l -0.10227,-0.0045 c -0.0186,-0.139435 -0.0372,-0.27887 -0.0434,-0.409839 -0.006,-0.130969 0,-0.253206 0.0101,-0.350838 0.0101,-0.09763 0.024,-0.170391 0.0426,-0.21537 0.0186,-0.04498 0.0418,-0.06191 0.11774,-0.07117 0.0759,-0.0095 0.20452,-0.01085 0.29361,-0.01164 0.0891,-7.94e-4 0.13864,-7.94e-4 0.17275,0.01376 0.0341,0.01482 0.0527,0.04419 0.0728,0.118534 0.0201,0.07435 0.0418,0.193675 0.048,0.330729 0.006,0.137319 -0.003,0.2921 -0.0163,0.395816 -0.0132,0.103982 -0.0302,0.156634 -0.0473,0.209286 l -0.10223,-0.0048 0.004,0.270669 1.63232,-1.481667 0.43302,-0.352689 z m -4.55713,4.0351597 10e-4,0.07647 0.0802,-0.07276 z m 10.8624897,0 -0.0767,0.0034 0.0755,0.06853 z" /> '
            + '</svg>');
    }

    public getPictogram(mapItemVisualization: MapItemVisualization): string {
        if (!mapItemVisualization) return this._pictograms.get('DEFAULT') as string;

        //if no fillcolor is set, then use default pictogram
        if (mapItemVisualization.fillColor === undefined) {
            if (this._pictograms.has(mapItemVisualization.pictogramId)) {
                return this._pictograms.get(mapItemVisualization.pictogramId) as string;
            }
        }
        else {
            const computedPictogramID: string = mapItemVisualization.pictogramId + '_' + mapItemVisualization.fillColor;

            if (this._pictograms.has(computedPictogramID))
                return this._pictograms.get(computedPictogramID) as string;

            //check if raw pictogram exists
            if (this._pictograms.has(mapItemVisualization.pictogramId)) {
                //create new one with colorcode
                const rawDat = this._pictograms.get(mapItemVisualization.pictogramId) as string;

                //Replace color
                //fill="%23bbc4d3" -> fill="mapItemVisualization.fillColor"
                //fill='%23bbc4d3' -> fill='mapItemVisualization.fillColor'
                const newDat: string = rawDat.replaceAll(`fill="%23FEFEFE"`, `fill="${mapItemVisualization.fillColor}"`);
                console.log(`create new Pictogram for ${computedPictogramID}`);

                this._pictograms.set(computedPictogramID, newDat);
                return newDat;
            }

            console.log(computedPictogramID + ' not found.');
        }
        return this._pictograms.get('DEFAULT') as string;
    }
}

export default new PictogramService();