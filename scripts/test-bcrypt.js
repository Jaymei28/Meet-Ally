import bcryptjs from 'bcryptjs';

const hashAdmin = '$2y$12$tN6BRD/S9D/kj9HA604CWebnUAK49WFAzog/An0zZD5gNUIzO.PyS';
const hashClient = '$2y$12$JfkV2EtSuDrKfZ.rJG7E1uS1El5IlqsMEbKiQ5OPRaX97vdkf6bzq';

console.log('Admin matches "password":', bcryptjs.compareSync('password', hashAdmin));
console.log('Client matches "password":', bcryptjs.compareSync('password', hashClient));
