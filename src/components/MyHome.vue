<template>
    <div>

         <div style="height: 75vh; width: 100%">
          <LMap :zoom="zoom" :center="center">
            <LTileLayer :url="url"></LTileLayer>

            <template v-for="rstop in resStops" :key="rstop.stop_id">
            
                <LMarker 
                    v-if="getStop5T(rstop.stop_id)" 
                    :lat-lng='getLatLon(rstop.stop_lat, rstop.stop_lon)'
                    @click="getOrario(rstop.stop_id)" 
                >
				
                        <!-- <LTooltip>
                        </LTooltip> -->
              </LMarker>
            </template>
          </LMap>
         </div>

        <div class="risultati">
            <table style="width:50%">
                <tr>
                    <th>Nome fermata</th>
                    <td>{{fermata}} </td>
                </tr>
                <tr>
                    <th>Partenza per</th>
                    <td> {{partePer}} </td>
                </tr>
                <tr v-for="(p,i) in orariOggi" :key="i">
                    <td>
                        {{p}} - {{destinazione[i]}}
                    </td>
                    
                </tr>
            </table> 
                
        </div>

    </div>
</template>

<script>
import { ref } from "vue";
import calendar from '../assets/json/calendar_dates.json';
import routes from '../assets/json/routes.json';
import shapes from '../assets/json/shape.json';
import stop_times from '../assets/json/stop_times.json';
import trips from '../assets/json/trips.json';
import stops from '../assets/json/stops.json';


    export default {
        setup(){
            const resCalendar = ref("");
            const resRoutes = ref("");
            const resStops = ref("");
            const resShapes = ref("");
            const resTrips = ref("");
            const resStop_times = ref([]);
            const filteredStops = ref([]);
            const departureTimes = ref([]);
            const orariOggi = ref([]);
            const fermata = ref("");

            const url = "https://{s}.tile.osm.org/{z}/{x}/{y}.png";
            const zoom = 13;
            const center = [44.1232, 9.7259];
            const destinazione = ref([]);
            const partePer = ref("");
            
            resCalendar.value = calendar;
            resRoutes.value = routes;
            resStops.value = stops;
            resStop_times.value = stop_times;
            resShapes.value = shapes;
            resTrips.value = trips;

            function getStop5T(check){
                if (
                    (check.toString().startsWith("VE")) ||
                    (check.toString().startsWith("RM")) ||
                    (check.toString().startsWith("MR"))
                ) return true;
            }
           
            function getFermata(stopID) {
                return stops.filter(
                    function(stops){ return stops.stop_id == stopID }
                );
            }

            function getDestinazione(tripID){
                return routes.filter(
                    function(routes){
                        return trips.filter(
                            function(trips){
                                return trips.trip_id == tripID
                            }
                        )[0].route_id == routes.route_id;
                    }
                )
            }

            function getOrariOggi(tripID){
                let dates = calendar.filter(
                    function(calendar){
                        return trips.filter(
                            function(trips){
                                return trips.trip_id == tripID
                            }
                        )[0].service_id == calendar.service_id;
                    }
                );

                for (let i=0; i<dates.length; i++){
                    if (dates[i].date == '20210415')
                        return true;
                }

                return false;
            }

            function getOrario(stopID){
                destinazione.value = [];
                orariOggi.value = []
                
                for (let i=0; i<resStop_times.value.length;i++){
                    if (resStop_times.value[i].stop_id == stopID){ 
                        fermata.value = getFermata(stopID)[0].stop_name; //nome della fermata
                        partePer.value = getDestinazione(resStop_times.value[i].trip_id)[0].route_long_name; // nome destinazione
                        
                        // controllo se l'orario è corrispondente alla data di oggi
                        // se si inserisco nell'array orariOggi
                        // nel caso in cui la fermata fosse l'ultima l'orario non è da considerarsi!
                        // occorre pertanto controllare il campo stop_sequence in stop_times

                        if (getOrariOggi(resStop_times.value[i].trip_id)) {
                            let total = stop_times.filter(x=> x.trip_id == resStop_times.value[i].trip_id);
                            // console.log("totale: "+total.length)
                            
                            if (total.length != resStop_times.value[i].stop_sequence){
                                destinazione.value.push(getDestinazione(resStop_times.value[i].trip_id)[0].route_long_name);
                                orariOggi.value.push(resStop_times.value[i].departure_time);
                            }
                        }
                            
                    }
                }

                orariOggi.value = orariOggi.value.sort();
            }

            

            function getLatLon(lat, lon){
                return [lat, lon];
            }

            return {
                getLatLon, 
                getStop5T, 
                getOrario,
                url, 
                zoom, 
                center, 
                resRoutes, 
                resStops,  
                resStop_times,  
                resTrips,  
                resShapes, 
                filteredStops,
                partePer,
                departureTimes,
                orariOggi,
                fermata,
                destinazione,
            };
        }        
    }
</script>

<style scoped>

.risultati{
    max-width: 800px;
    margin: auto 1rem;
}

</style>