// React
import {
  MouseEventHandler,
  FormEvent,
  useState,
  useCallback,
  useMemo,
} from 'react';

// Libs
import classnames from 'classnames';

// Components
import { HUDWindow } from '../../../components/HUDWindow';
import { Form } from '../../../components/Form';
import { HUDInput } from '../../../components/HUDInput';
import { HUDButton } from '../../../components/HUDButton';
import { Flexbox } from '../../../components/Flexbox';

// Context
import { useCurrentPlanet } from '../../../contexts/SpaceTravelContext.tsx';

// API
import {
  CreateUpdateAstronautRequestBody,
  Astronaut,
} from '../../../api/astronaut.api';

// Styles
import styles from './AstronautForm.module.css';
import {
  AutoCompleteOptionType,
  HUDAutoComplete,
} from '../../../components/HUDAutoComplete/HUDAutoComplete.tsx';
import { getPlanetListByNameAPICall } from '../../../api/planet.api.ts';

type AstronautFormProps = {
  astronautForUpdate?: Astronaut | null;
  className?: string;
  mode?: string;
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onSubmit: (astronaut: CreateUpdateAstronautRequestBody) => void;
};

type FormStateType = {
  firstname?: string;
  lastname?: string;
  planet?: string;
};

export function AstronautForm({
  astronautForUpdate,
  className,
  mode = 'create',
  onCancel,
  onSubmit,
}: AstronautFormProps) {
  const componentClassNames = classnames(styles.astronautform, className);
  const { currentPlanet } = useCurrentPlanet();
  const canCreate = useMemo(
    () =>
      mode === 'create' &&
      currentPlanet !== 'NO_WHERE' &&
      currentPlanet?.isHabitable,
    [currentPlanet, mode],
  );

  const [formState, setFormState] = useState<FormStateType>({});
  const [astronautFirstname, setAstronautFirstname] = useState(
    astronautForUpdate?.firstname || '',
  );
  const [astronautLastname, setAstronautLastname] = useState(
    astronautForUpdate?.lastname || '',
  );
  const [astronautOriginPlanet, setAstronautOriginPlanet] = useState(
    astronautForUpdate?.id.toString() || '',
  );

  const validateAndSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const validationErrors: FormStateType = {};
      if (astronautFirstname === '') {
        validationErrors.firstname = 'firstname is required';
      }
      if (astronautLastname === '') {
        validationErrors.lastname = 'lastname is required';
      }
      if (astronautOriginPlanet === '') {
        validationErrors.planet = 'planet of origin is required';
      }

      // submit the form if there is no validation error
      if (
        !Object.keys(validationErrors).length &&
        astronautFirstname &&
        astronautLastname &&
        astronautOriginPlanet
      ) {
        onSubmit({
          firstname: astronautFirstname,
          lastname: astronautLastname,
          originPlanetId: parseInt(astronautOriginPlanet),
        });
      } else {
        setFormState(validationErrors);
      }
    },
    [astronautFirstname, astronautLastname, astronautOriginPlanet, onSubmit],
  );

  return (
    <Flexbox className={componentClassNames} flexDirection='column'>
      <HUDWindow>
        {mode === 'create' ? (
          <h2>Create an Astronaut</h2>
        ) : (
          <h2>Edit an Astronaut</h2>
        )}
        <Form
          onSubmit={validateAndSubmit}
          className={styles.astronautformForm}
          noValidate
        >
          <HUDInput
            name='firstname'
            label='firstname'
            placeholder='John'
            required
            value={astronautFirstname}
            error={formState.firstname}
            onChange={(e) => setAstronautFirstname(e.target.value)}
          />
          <HUDInput
            name='lastname'
            label='lastname'
            placeholder='Doe'
            required
            value={astronautLastname}
            error={formState.lastname}
            onChange={(e) => setAstronautLastname(e.target.value)}
          />
          <HUDAutoComplete
            fetchOptions={getPlanetListByNameAPICall}
            label={'Planet'}
            onChange={(selectedOption: AutoCompleteOptionType) =>
              setAstronautOriginPlanet(selectedOption.value)
            }
            defaultValue={
              astronautForUpdate
                ? {
                    label: astronautForUpdate.originPlanet.name,
                    value: astronautForUpdate.id.toString(),
                  }
                : {
                    label: '',
                    value: '',
                  }
            }
          />
          <Flexbox
            className={styles.astronautformButtons}
            alignItems='center'
            justifyContent='center'
          >
            <HUDButton onClick={onCancel}>CANCEL</HUDButton>
            {mode === 'create' ? (
              <HUDButton
                disabled={!canCreate}
                onClick={() => validateAndSubmit}
              >
                CREATE
              </HUDButton>
            ) : (
              <HUDButton onClick={() => validateAndSubmit}>EDIT</HUDButton>
            )}
          </Flexbox>
        </Form>
      </HUDWindow>
      {mode !== 'edit' && !canCreate && (
        <HUDWindow className={styles.astronautformCannotCreate}>
          <h2>Warning !</h2>
          <p>
            Cannot create an astronaut because the current planet don \'t
            shelters life.
          </p>
          <p>Travel to an another planet to add an astronaut.</p>
        </HUDWindow>
      )}
    </Flexbox>
  );
}
