import { Input, Label, TextField } from "@heroui/react";
import { JSX } from "react";



export const ListReservationsInputs = ({resourceId, setResourceId, paginationSize, setPaginationSize, page, setPage, styles}): JSX.Element => (
  <>
    <TextField>
      <label htmlFor="resourceId">
        Resource ID
      </label>
      <Input
        type="number"
        placeholder="id"
        id="resourceId"
        name="resourceId"
        value={resourceId}
        className={`${styles.idInput} border border-2 rounded-md`}
        onChange={(e) => setResourceId(e.target.value)}
      />
    </TextField>
    <TextField>
      <Label htmlFor="paginationSize">
        Pagination size
      </Label>
      <Input
        type="number"
        placeholder="#"
        name="paginationSize"
        min="1"
        value={paginationSize}
        className={`${styles.idInput} border border-2 rounded-md`}
        onChange={(e) => setPaginationSize(e.target.value)}
      />
    </TextField>
    <TextField>
      <Label htmlFor="page">
        Page #
      </Label>
      <Input
        type="number"
        placeholder="#"
        name="page"
        min="1"
        value={page}
        className={`${styles.idInput} border border-2 rounded-md`}
        onChange={(e) => setPage(e.target.value)}
      />
    </TextField>
  </>
)