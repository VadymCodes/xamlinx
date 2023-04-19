import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faArrowRight,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import {
  LocationClient,
  SearchPlaceIndexForTextCommand,
  SearchPlaceIndexForTextCommandInput,
} from '@aws-sdk/client-location';
import { Signer } from '@aws-amplify/core';
import {
  Map,
  RequestParameters,
  ResourceType,
  Marker,
  LngLatLike,
  NavigationControl,
  FullscreenControl,
  Popup,
} from 'maplibre-gl';

import _members from '../../../assets/members.json';
import { environment } from 'src/environments/environment';

type Member = {
  active: boolean;
  id: number;
  details: {
    avatar: string;
    firstName: string;
    lastName: string;
    linkedin_url: string;
    location: {
      city: string;
      country: string;
      nearest_landmark: string;
      state: string;
      coordinate?: LngLatLike;
    };
    summary: string;
    position: string;
  };
};

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about-1.component.scss', './about-2.component.scss'],
})
export class AboutComponent implements OnInit {
  // Amazon Location Client
  _locationClient: LocationClient = {} as any;
  _map: Map = {} as any; // Maplibre-gl Map

  // Icons
  faArrowRight = faArrowRight;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  // Members
  groups: Member[][] = []; // Grouping to display on carousel
  members = (_members as { members: Member[] }).members.map((member) => ({
    ...member,
    active: false,
  })); // Read from members.json

  // Viewport states
  renderingMembersCount = 4;
  screenTablet = false;
  screenMobile = false;
  screenExSmall = false;
  loadingMap = false; // Whether the map is being loaded

  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;

    if (screenWidth > 992) {
      this.renderingMembersCount = 4;
    } else if (screenWidth <= 992 && screenWidth > 768) {
      this.renderingMembersCount = 3;
    } else if (screenWidth <= 768 && screenWidth > 576) {
      this.renderingMembersCount = 2;
    } else {
      this.renderingMembersCount = 1;
    }

    this._populateGroups();
  }

  ngOnInit(): void {
    // Initializing
    // First check the viewport size
    this.onResize();
    // Initializing Amazon Location Service
    this._locationClient = new LocationClient({
      region: environment.AMAZON_REGION,
      credentials: {
        accessKeyId: environment.AMAZON_ACCESS_KEY,
        secretAccessKey: environment.AMAZON_SECRECT_KEY,
      },
    });
    // Initialize map
    this._initializeMap();
  }

  _populateGroups() {
    // Grouping every 4 members into single group
    this.groups = [];

    for (
      let index = 0;
      index < this.members.length;
      index += this.renderingMembersCount
    ) {
      this.groups.push(
        this.members.slice(index, index + this.renderingMembersCount)
      );
    }
  }

  /**
   * Sign requests made by MapLibre GL JS using AWS SigV4.
   */
  _transformRequest(
    url: string,
    resourceType: ResourceType
  ): RequestParameters {
    if (resourceType === 'Style' && !url.includes('://')) {
      // resolve to an AWS URL
      url = `https://maps.geo.${environment.AMAZON_REGION}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
    }

    if (url.includes('amazonaws.com')) {
      // only sign AWS requests (with the signature as part of the query string)
      return {
        url: Signer.signUrl(url, {
          access_key: environment.AMAZON_ACCESS_KEY,
          secret_key: environment.AMAZON_SECRECT_KEY,
        }),
      };
    }

    // don't sign
    return { url };
  }

  async _initializeMap() {
    // Set loading state
    this.loadingMap = true;

    // Initialize the map
    const _map = new Map({
      container: 'map',
      center: [0, 0], // initial map centerpoint
      zoom: 1.2, // initial map zoom,
      minZoom: 1.2,
      style: 'XamlinxMap',
      transformRequest: this._transformRequest,
    });

    _map.addControl(new NavigationControl());
    _map.addControl(new FullscreenControl());

    // Get coordinate for each members
    for (const member of this.members) {
      const params: SearchPlaceIndexForTextCommandInput = {
        IndexName: 'XamlinxPlaceIndex',
        Text: member.details.location.nearest_landmark,
        FilterCountries: [member.details.location.country],
      };
      const command = new SearchPlaceIndexForTextCommand(params);

      const response = await this._locationClient.send(command);
      const coordinate = (
        response.Results
          ? response.Results[0].Place?.Geometry?.Point || [0, 0]
          : [0, 0]
      ) as LngLatLike;

      // Set the coordinate for later navigation
      member.details.location.coordinate = coordinate;

      // Create the popup
      const popup = new Popup({ offset: 25 }).setText(
        member.details.firstName + ' ' + member.details.lastName
      );

      // Add member's location marker to the map
      new Marker().setLngLat(coordinate).addTo(_map).setPopup(popup);
    }

    this._map = _map;
    this.loadingMap = false;
  }

  /**
   * 'Request exam' button click event handler
   */
  onRequestAnExam() {
    this.router.navigate(['/', 'requests']);
  }

  /**
   * Arrow click event handler.
   * @param carousel Reference to the bootstrap's carousel
   * @param direction false: Previous, true: Next slide
   */
  onArrowClick(carousel: NgbCarousel, direction: boolean) {
    if (direction) {
      carousel.next();
      return;
    }

    carousel.prev();
  }

  /**
   * Member carousel item click handler
   * @param memberId The id of the clicked member
   */
  onMemberClick(memberId: number) {
    // Find group index and member index
    let memberIndex = -1;
    const groupIndex = this.groups.findIndex((group) =>
      group.find((member, index) => {
        if (member.id === memberId) {
          memberIndex = index;
          return true;
        }

        return false;
      })
    );

    if (memberIndex !== -1 && groupIndex !== -1) {
      // Reset the active state for all members item
      this.groups.forEach((group) =>
        group.forEach(
          (member) =>
            (member.active = member.id !== memberId ? false : member.active)
        )
      );

      this.groups[groupIndex][memberIndex].active =
        !this.groups[groupIndex][memberIndex].active;
    }
  }

  /**
   * 'Join now' button click event handler
   */
  onJoinClick() {
    this.router.navigate(['/', 'signup']);
  }

  /**
   * Member's Location click event handler
   * @param member Member being clicked
   */
  async onMemberLocation(member: Member) {
    this._map.flyTo({
      center: member.details.location.coordinate || [0, 0],
      zoom: 10,
    })
  }
}
