import { KeycloakService } from './../../services/keycloak.service';
import { Storage } from '@ionic/storage';
import { CommandResourceService, QueryResourceService } from 'src/app/api/services';
import { LocationService } from './../../services/location.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { WorkPlaceDTO } from 'src/app/api/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-workplace-modal',
  templateUrl: './add-workplace-modal.component.html',
  styleUrls: ['./add-workplace-modal.component.scss'],
})
export class AddWorkplaceModalComponent implements OnInit {

  static _WORKPLACES_KEY = 'workplaces';

  excludes: string[] = [];

  did: number;

  searchLocation = '';

  searchClinic = '';

  selectedLocation: any;

  locationSuggetions: any[] = [];

  firstTime = true;

  workPlace: WorkPlaceDTO = {};

  updateMode = false;

  nameUpdatedStatus = false;
  private workplaces: WorkPlaceDTO[] = [];
  private workplaceBehaviour = new BehaviorSubject<WorkPlaceDTO[]>(this.workplaces);

  constructor(private modalController: ModalController,
              private locationService: LocationService,
              private commandResourceService: CommandResourceService,
              private queryResourceService: QueryResourceService,
              private storage: Storage,
              private keycloakService: KeycloakService) { }

  ngOnInit() {
    if (this.updateMode === true) {
      this.searchClinic = this.workPlace.name;
      this.searchLocation =  this.workPlace.locationName;
      this.selectedLocation = {};
    }
  }

  search() {
    this.firstTime = false;
    this.locationService.getPredictions(this.searchLocation)
    .subscribe(locationData => {
      this.locationSuggetions = locationData;
    });
    this.remove();
  }

  select(locationData: any) {
    this.locationSuggetions = [];
    this.selectedLocation = locationData;
    this.searchLocation = locationData.description;
    console.log(this.searchLocation);
  }

  save() {
    if (this.updateMode === false) {
      console.log('Adding Wokplace');
      this.locationService.getGeoFromPlace(this.selectedLocation.description,
        (results, status) => {
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();
          const latLong = latitude + ',' + longitude;
          this.addWorkplace(this.searchClinic , latLong , this.searchLocation , this.did);
          this.modalController.dismiss();
        });
    } else {
      console.log('Updating Wokplace');
      let description = this.selectedLocation.description;
      if (this.selectedLocation === undefined) {
        description = this.workPlace.locationName;
      }
      console.log(description);

      this.locationService.getGeoFromPlace(description,
        (results, status) => {
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();
          const latLong = latitude + ',' + longitude;
          this.workPlace.name = this.searchClinic;
          this.workPlace.location = latLong;
          this.workPlace.locationName = this.searchLocation;
          this.updateWorkplace(this.workPlace);
          this.modalController.dismiss();
        });
    }
  }

  nameUpdated() {
    this.nameUpdatedStatus = true;
  }

  remove() {
    console.log('removed');
    this.selectedLocation = undefined;
  }
  cancel() {
    this.modalController.dismiss();
  }

  public addWorkplace(name: string , location: string , locationName: string , did: number) {
    this.createWorkplace(name , location , locationName , did)
    .subscribe(workplaceResult => {
      this.initWorkplaces(true);
    });
  }

  createWorkplace(name, location, locationName, did) {
    const workplace: WorkPlaceDTO = {};
    workplace.doctorId = did;
    workplace.name = name;
    workplace.locationName = locationName;
    workplace.location = location;
    return this.commandResourceService.createWorkPlaceUsingPOST(workplace);
  }

  public initWorkplaces(fromRestAPI?: boolean) {
    const func = (user: any) => {
      this.queryResourceService.findWorkPlacesByDoctorIdpCodeUsingGET({
        doctorIdpCode: user.preferred_username})
        .subscribe(workplaces => {
          this.workplaceBehaviour.next(workplaces.content);
          this.storage.set(AddWorkplaceModalComponent._WORKPLACES_KEY, workplaces);
        });
    };

    if (fromRestAPI !== undefined && fromRestAPI === true) {
      this.keycloakService.getCurrentUserDetails().then(func);
    } else {
      this.storage.get(AddWorkplaceModalComponent._WORKPLACES_KEY).then(data => {
        if (data === null) {
          this.keycloakService.getCurrentUserDetails().then(func);
        } else {
          this.workplaceBehaviour.next(data);
        }
      });
    }
  }

  public updateWorkplace(workplace: WorkPlaceDTO) {
    this.updateWorkplaces(workplace)
    .subscribe(workplaceResult => {
      this.initWorkplaces(true);
    });
  }

  updateWorkplaces(workplace: WorkPlaceDTO) {
    return this.commandResourceService.updateWorkPlaceUsingPUT(workplace);
  }


}
