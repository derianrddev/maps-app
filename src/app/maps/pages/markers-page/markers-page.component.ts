import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}

@Component({
  selector: 'maps-markers-page',
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent implements AfterViewInit {
  @ViewChild('map')
  public divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];

  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-84.03, 9.72);

  ngAfterViewInit(): void {
    if ( !this.divMap ) throw 'The element HTML does not found';

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 7, // starting zoom
    });

    this.readFromLocalStorage();
  }

  createMarker(): void {
    if ( !this.map ) throw 'Map not initialized';

    const lgnLat = this.map.getCenter();
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));

    this.addMarker(lgnLat, color);
  }

  addMarker(lngLat: LngLat, color: string): void {
    if ( !this.map ) throw 'Map not initialized';

    const marker = new Marker({
      color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({ color, marker });
    this.saveToLocalStorage();

    marker.on('dragend', () => this.saveToLocalStorage());
  }

  deleteMarker(index: number): void {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
    this.saveToLocalStorage();
  }

  flyTo(marker: Marker): void {
    if ( !this.map ) throw 'Map not initialized';

    this.map.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    });
  }

  saveToLocalStorage(): void {
    const plainMarkers: PlainMarker[] = this.markers.map( ({ color, marker }) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ));
  }

  readFromLocalStorage(): void {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString );

    plainMarkers.forEach( ({ color, lngLat }) => {
      const [ lng, lat ] = lngLat;
      const coordinates = new LngLat( lng, lat );

      this.addMarker( coordinates, color );
    })

  }
}
