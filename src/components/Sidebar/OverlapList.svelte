<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { locale } from 'svelte-i18n';
  import {
    mapStore,
    selectedBoundaryMap,
    selectedDistrict,
    selectedCoordinates,
    darkMode
  } from '../../stores';
  import { layers } from '../../assets/boundaries';
  import DistrictLink from './DistrictLink.svelte';
  import type { Feature } from 'geojson';
  import { colors } from '../../helpers/colors';
  import { getOfficialDetails } from '../../helpers/helpers';

  import Loader from '../Loader.svelte';

  interface Props {
    districts: Feature[];
    isLoading: boolean;
  }

  let { districts, isLoading }: Props = $props();

  function showIntersectingDistrict(feature: Feature) {
    if (!browser || !$mapStore || !$mapStore.getSource) return;

    if (!$mapStore.getSource('intersecting-layer')) {
      $mapStore.addSource('intersecting-layer', {
        type: 'geojson',
        data: feature
      });

      $mapStore.addLayer({
        id: 'intersecting-layer',
        type: 'fill',
        source: 'intersecting-layer',
        paint: {
          'fill-color': $darkMode ? colors['dark-default'] : colors['default'],
          'fill-opacity': 0.2
        }
      });

      $mapStore.addLayer({
        id: 'intersecting-stroke-layer',
        type: 'line',
        source: 'intersecting-layer',
        paint: {
          'line-color': $darkMode ? colors['dark-default'] : colors['default'],
          'line-width': 2
        }
      });
    } else {
      const source = $mapStore.getSource('intersecting-layer');
      source.setData(feature);
    }
  }

  function hideIntersectingDistrict() {
    if (!browser || !$mapStore || !$mapStore.getSource) return;

    if ($mapStore.getSource('intersecting-layer')) {
      $mapStore.removeLayer('intersecting-layer');
      $mapStore.removeLayer('intersecting-stroke-layer');
      $mapStore.removeSource('intersecting-layer');
    }
  }
</script>

{#if isLoading}
  <div class="px-4">
    <Loader />
  </div>
{:else if districts.length === 0}
  <div class="px-4">
    Couldn't load any districts. {$selectedCoordinates &&
      'Make sure you select coordinates within BLR.'}
  </div>
{:else}
  {#each Object.entries(layers).filter(([key, _]) => key !== 'boundaries') as [key, value], index}
    {#if districts.filter(district => district.properties?.id === key).length}
      <div class="divide-y divide-gray-100 dark:divide-neutral-700">
        {#each districts.filter(district => district.properties?.id === key) as district}
          {@const officialDetails = getOfficialDetails(
            district.properties?.id,
            district.properties?.namecol
          )}
          {@const nameColKn = officialDetails
            ? officialDetails.AreaKN
            : district.properties?.namecol}
          <div
            class:bg-white={index % 2 === 0}
            class:dark:bg-neutral-900={index % 2 === 0}
            class:bg-gray-100={index % 2 !== 0}
            class:dark:bg-neutral-800={index % 2 !== 0}
          >
            <DistrictLink
              onMouseOver={() => showIntersectingDistrict(district)}
              onMouseOut={() => hideIntersectingDistrict()}
              onClick={() => {
                $selectedBoundaryMap = district.properties?.id;
                $selectedDistrict = district.properties?.namecol;
                hideIntersectingDistrict();
              }}
              icon={layers[district.properties?.id].icon}
              nameCol={$locale?.startsWith('kn')
                ? nameColKn
                : district.properties?.namecol}
              nameLong={$locale?.startsWith('kn')
                ? value.name_long_kn
                : value.name_long}
            />
          </div>
        {/each}
      </div>
    {/if}
  {/each}
{/if}
