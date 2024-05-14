import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range-page',
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map')
  public divMap?: ElementRef;

  public zoom: number = 7;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-84.03, 9.72);

  ngAfterViewInit(): void {
    if ( !this.divMap ) throw 'The element HTML does not found';

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners(): void {
    if ( !this.map ) throw 'Map not initialized';

    this.map.on('zoom', (event) => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (event) => {
      if ( this.map!.getZoom() < 18 ) return;

      this.map!.zoomTo(18);
    });

    this.map.on('move', (event) => {
      this.currentLngLat = this.map!.getCenter();
    });
  }

  zoomIn(): void {
    if ( !this.map ) throw 'Map not initialized';

    this.map.zoomIn();
  }

  zoomOut(): void {
    if ( !this.map ) throw 'Map not initialized';

    this.map.zoomOut();
  }

  zoomChanged(value: string) {
    if ( !this.map ) throw 'Map not initialized';

    this.zoom = Number(value);
    this.map.zoomTo(this.zoom);
  }


}
